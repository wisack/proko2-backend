const config = require("../utils/config.js")
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Group = require('../models/group')
const Student = require('../models/student')
const User = require('../models/user')
const Occasion = require('../models/occasion')
//const defaultCards = require("../utils/cards.js")
const FeedBack = require('../models/feedBack')
const ProGroup = require("../models/proGroup.js")
const ProGroupOccasion = require("../models/proGroupOccasion.js")
const OccasionCard = require("../models/occasionCard.js")
const DefaultOccasionCardSet = require("../models/defaultOccasionCardSet.js")

const {createEmptyOccasion, populateOccasionStructure} = require("./occasion.js")
const getProGroupById = async (id) => {
    try {
        const it = await ProGroup.findOne({ user: id })
        return it
    } catch (error) {
        console.log(error, "getPrGroupById")
        return []
    }
}
//----------------------------------------
//@ proGroup is from getProGroupById
//@ fills structure with model data from the database to be sent back to the client
const populateProGroupStructure_Array = async (ids) => {
    try{
        let waitArray = [];
        for(const id of ids){
            waitArray.push(
                ProGroup.findOne({ user: id })
                    .populate({ path: "students", model: Student }) //get student names and ids
                    .populate({ path: "user", model: User, select: "-username"}) //we don't care about instructors actual username
                    .populate({ path: "occasions", model: ProGroupOccasion,
                                populate: [
                                    {path: "alkuperainenKortti", model: OccasionCard},
                                    {path: "muokattuKortti", model: OccasionCard},
                                    {path: "palaute", model: FeedBack},
                                ]
                              })
            )
        }
        let results = []
        
        for(const toWait of waitArray){
            const result = await toWait
            
            let it = result.toJSON();

            let newOccasions = [];
            
            for(occasion of it.occasions){
                //occasion.user = result.user;
                newOccasion = populateOccasionStructure(occasion,
                                                        occasion.muokattuKortti ? occasion.muokattuKortti : occasion.alkuperainenKortti,
                                                        it.students)

                if(occasion.muokattuKortti){
                    delete newOccasion.muokattuKortti
                }
                
                
                newOccasions.push(newOccasion)
            }
            it.occasions = newOccasions;
            results.push(it)
        }

        return results;
    }catch(error){
        console.log( "populate progroup structure", error);
        return []
    }        
}
const populateProGroupStructure = async (id) => {
    try{
        //----------------------------------------
        const results = await populateProGroupStructure_Array([id])
        return results[0]
    } catch (error) {
        console.log("populate progroup structure", error)
        return undefined
    }
}
//user should contain atleast role for now
//this can be extended to search for other than expected_role from the available cardsets, but currently we only care about the users role
//H Peteri 2022

const getDefaultCardSetForUser = async (user, vuosi) => {
    try{
        const setFound = await DefaultOccasionCardSet.findOne({vuosi: vuosi, expected_role: user.role})
        if(!setFound) return []

        let cards = []
        for(const card_id of setFound.card_ids){
            let cardFound = await OccasionCard.findOne({_id: card_id})

            if(cardFound){
                cards.push({
                    id: cardFound._id.toString(),
                    otsikko: cardFound.otsikko
                })
            }
        }
        return cards
        
    }catch(error){
        console.log("getDefualtCardSetForUser", error)
        return []
    }
}

//----------------------------------------

/*
async function createDefaultCardSets(){
    await createDefaultCardSet({role: "pro"});
    await createDefaultCardSet({role: "kummi"});
}
//Create default cardset based on users role
//@NOTE this shouldn't be used after occasion cards can be created from the frontend ui.
//@NOTE Currently when database is cleared then default cardsets are created 17/6/2022.
async function createDefaultCardSet(user){
    try{
        const vuosi = new Date().getFullYear();
        let defaultOccasions
        
        if (user.role === "pro") {
            defaultOccasions = defaultCards.pro_cards;
        } else {
            defaultOccasions = defaultCards.kummi_cards;
        }
        const setFound = await DefaultOccasionCardSet.findOne({vuosi: vuosi, expected_role: user.role});    
        if(!setFound){
            let cardSet = new DefaultOccasionCardSet({
                vuosi: vuosi,
                expected_role: user.role,
                card_ids: []
            })
            
            for(const occasion of defaultOccasions){
                let card = new OccasionCard({
                    vuosi: occasion.vuosi ? occasion.vuosi : vuosi,
                    otsikko: occasion.otsikko,
                    aiheet: occasion.aiheet,
                })
                const savedCard = await card.save()
                cardSet.card_ids.push(savedCard.id)
            }
            await cardSet.save()     
        }else{
            console.log(`Cardset already found for ${vuosi} ${user.role}`);
        }
    }catch(error){
        console.log(error);
    }
}
*/

// admins create groups endpoint. Groups are created with a csv file. Expects array of student strings and pros data.
router.post('/', async (req, res) => {
    try {
        const vuosi = new Date().getFullYear();
        
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const admin = await User.findById(decodedToken.id)
        if (admin.role !== "admin") {
            return res.status(401).json({ error: 'Vain tietokannan hallitsija voi luoda uusia käyttäjiä.' })
        }
        const user = await User.findById(req.body.user.id)
        console.log("Creating group for user", user.name)
        
        let opiskelijat = []
        for (let i = 0; i < req.body.students.length; i++) {
            const student = new Student({
                name: req.body.students[i]
            })
            const savedStudent = await student.save()
            opiskelijat.push(savedStudent)
        }
        //----------------------------------------        
        const proGroup  = new ProGroup({
            science: user.science,
            vuosi: vuosi,
            name: user.name,
            students: opiskelijat,
            user: user.id,
            occasions: []
        })
        
        //Create occasions for the default cardset
        const set = await DefaultOccasionCardSet.findOne({vuosi: vuosi, expected_role: user.role});
        
        if(set){
            for(const card_id of set.card_ids){
                const savedPalaute = await (new FeedBack({})).save()

                let occasion = new ProGroupOccasion({
                    palaute: savedPalaute._id,
                    user: user.id, 
                    alkuperainenKortti: card_id,
                    ...await createEmptyOccasion(),
                });
                const savedOccasion = await occasion.save()            
                proGroup.occasions.push(savedOccasion.id)
            }
            
        }
        const savedProGroup = await proGroup.save()
        user.group = savedProGroup._id
        await user.save()
        //----------------------------------------
        res.status(201).json(savedProGroup)

    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})


// pros edit group endpoint. For adding or removing a student
router.put('/:id', async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const foundProGroup = await getProGroupById(decodedToken.id)
        
        const maxNameLength = config.groupLimits.maxNameLength
        const maxStudentCount = config.groupLimits.maxStudentCount
        
        const addCount = Math.min(maxStudentCount - foundProGroup.students.length, req.body.addStudents.length)
        const studentsToAdd = req.body.addStudents.slice(0, addCount)

        let uudetOpiskelijat = []
        for(const student of studentsToAdd){
            const newOpiskelija = Student({
                name: student.name.substring(0, maxNameLength),
            })
            const savedStudent = await newOpiskelija.save()
            uudetOpiskelijat.push(savedStudent)
        }
        if(req.body.removeStudents){
            const toRemove = req.body.removeStudents.map(s => s.id.toString())
            for(let i = 0; i < toRemove.length; i++){
                foundProGroup.students = foundProGroup.students.filter(s => s.toString() !== toRemove[i])
            }
            await Student.deleteMany({ _id: { $in: toRemove } })
        }
        foundProGroup.students = foundProGroup.students.concat(uudetOpiskelijat)
        const savedProGroup = await foundProGroup.save()
        
        //----------------------------------------
        
        let populatedGroup = await populateProGroupStructure(decodedToken.id)
        let result = {
            ...populatedGroup,
            availableCards: await getDefaultCardSetForUser(populatedGroup.user, foundProGroup.vuosi),
        }
        return res.json(result)
        //res.json(await populateProGroupStructure(decodedToken.id))

    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }

})
// find pros group using token
router.get('/', async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (decodedToken) {
            const foundProGroup = await getProGroupById(decodedToken.id)

            let b = await populateProGroupStructure(decodedToken.id)
            let c = {
                ...b,
                availableCards: await getDefaultCardSetForUser(b.user, foundProGroup.vuosi),
            }
            return res.json(c)
        } else {
            return (res.status(401).json({ error: 'Sinulla ei ole riittävästi oikeuksia tähän toimintoon.' }))
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})

//Get group from occasion id
//This is used when viewing modified occasions H Peteri 2022
router.get('/:id', async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        // at the moment only admin is using this
        if (user.role != 'admin') {
            return (res.status(401).json({ error: 'Sinulla ei ole riittävästi oikeuksia tähän toimintoon.' }))
        }
        const foundProGroup = await ProGroup.findOne({occasions: req.params.id })
        let it = await populateProGroupStructure(foundProGroup.user)
        it.occasions = it.occasions.filter(it => it.id === req.params.id)
        res.json(it)
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})

module.exports = {
    router,
    populateProGroupStructure,
    populateProGroupStructure_Array,
}
