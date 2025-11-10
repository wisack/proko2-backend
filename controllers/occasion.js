const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Group = require('../models/group')
const User = require('../models/user')
const FeedBack = require('../models/feedBack')
const Occasion = require('../models/occasion')
const config = require('../utils/config')

//----------------------------------------
const Student = require('../models/student')
const ProGroup = require("../models/proGroup.js")
const ProGroupOccasion = require("../models/proGroupOccasion.js")
const OccasionCard = require("../models/occasionCard.js")
const DefaultOccasionCardSet = require("../models/defaultOccasionCardSet.js")
//----------------------------------------

// max textfield lengths
//@@DEPRECATE THIS
const headerLength = config.textFieldSizes.headerLength      //otsikot, alaotsikot, password
const maxTopicCount = config.textFieldSizes.maxTopicCount      //main and subtopics plus lisäaiheet
const smallTextfield = config.textFieldSizes.smallTextfield    //e.g aihe.aihe
const mediumTextfield = config.textFieldSizes.mediumTextfield  //e.g aihe.ohje
const largeTextfield = config.textFieldSizes.largeTextfield   //e.g toiveet, kotitehtava, muokkaus
const maxOccasionCount = 40  //user can't have more occasions than this

const maxTextLength_header = config.textFieldSizes.headerLength
const maxTextLength_small = config.textFieldSizes.smallTextfield
const maxTextLength_medium = config.textFieldSizes.mediumTextfield


const populateOccasionStructure = (occasion, card, studentInfo) => {
    try{
        //----------------------------------------
        //@Sanity check
        //This structure is returned back to the user by the API
        //So occasion should have feedback filled, if occasion has been returned.
        if(occasion.palautettu && typeof(occasion.palaute.id) !== "string"){
            console.log("populateOccasionStructure called without occasion.palaute being filled");
            new Error();
        }
        //----------------------------------------
        //this should be cleaned up, not every field is neccessary.
        const it = {
            ...occasion,
            aiheet: card.aiheet,
            otsikko: card.otsikko,
            lisäAiheet: occasion.lisaAiheet, //@NOTE frontend uses lisäAiheet and not lisaAiheet... this can otherwise be removed
        }
        let topics = []
        it.aiheet.forEach( (topic, index) => {
            let tasks = []
            topic.aiheet.forEach(aihe => {
                tasks.push({...aihe,
                            lapikayty : it.suoritetutAiheet.find( id => {return (aihe.id === id || aihe.original_id === id)})? true : false})
            })                          
            topics.push({...topic,
                         aiheet: tasks})
        })    
        it.aiheet = topics;

        it.paikalla = it.paikalla.map(paikalla_id => studentInfo.find( student => student.id === paikalla_id)).filter(student => student)
        
        return it;
    }catch(error){
        console.log("error ->", error)
        return undefined
    }
}
const createEmptyOccasion = () => {
    return {
        paikalla: [],
        ohjaustapa: "Opiskellen",
        ohjauspaikka: "",
        toiveet: "",
        kotitehtava: "",
        lisaAiheet: "",
        kesto: 0,
        sisallytysKesto: 0,
        date: new Date(),
    }
}
const createCustomOccasion = (createInfo) => {
    return {
        ...createEmptyOccasion(),
        ohjaustapa: createInfo.ohjaustapa ? createInfo.ohjaustapa : "Opiskellen",
        ohjauspaikka: createInfo.ohjauspaikka ? createInfo.ohjauspaikka : "",
        date: createInfo.date ? createInfo.date : new Date(),
        paikalla: createInfo.paikalla?  createInfo.paikalla : [],
        toiveet : createInfo.toiveet?  createInfo.toiveet : "",
        kotitehtava : createInfo.kotitehtava? createInfo.kotitehtava : "",
        kesto : createInfo.kesto? createInfo.kesto : 0,
        sisallytysKesto: createInfo.sisallytysKesto? createInfo.sisallytysKesto : 0,
        lisaAiheet : createInfo.lisäAiheet ? createInfo.lisäAiheet?.slice(0, maxTopicCount).map(it => it.substring(0, maxTextLength_small)) : [],
        suoritetutAiheet : createInfo.aiheet?.length ? createInfo.aiheet.map(it => it.aiheet) //get array of cleared aihe ids
            .reduce((result, aiheet) => result.concat(aiheet)) 
            .filter(aihe => aihe.lapikayty) 
            .map(aihe => aihe.original_id ? aihe.original_id : aihe.id) : [],
        suoritettu: createInfo.suoritettu? createInfo.suoritettu : false,
        muokattu: createInfo.muokattu? createInfo.muokattu : false,
        muokkaus: createInfo.muokkaus? createInfo.muokkaus : "",
    }
}

//@Called when card is modified but there is not a modified version created yet
const createOccasionCardAndSave = async (otsikko, uudetAiheet, vuosi) => {
    try{
        const newCard = new OccasionCard({
            otsikko: otsikko,
            aiheet: [],
            vuosi: vuosi,
        })
        for(const topic of uudetAiheet){
            let topicCopy = {
                original_id: topic.id,
                alaotsikko: topic.alaotsikko,
                aiheet: []
            }                
            for(const task of topic.aiheet){
                let taskCopy = {
                    original_id: task.id,
                    aihe: task.aihe,
                    ohje: task.ohje,
                }
                topicCopy.aiheet.push(taskCopy)
            }
            newCard.aiheet.push(topicCopy)
        }
        let it = await newCard.save()
        return it
    }catch(error){
        console.log("createOccasionCardAndSave", error)
        return undefined;
    }
}
//Create custom card from request body
const createCustomOccasionCard = async (createCardInfo) => {
    try{
        createCardInfo.otsikko = createCardInfo.otsikko.substring(0, maxTextLength_header)
        //----------------------------------------
        //Trim createInfo fields
        const aiheet_trimmed = createCardInfo.aiheet?.slice(0, maxTopicCount)
        aiheet_trimmed?.forEach(topic => {
            topic.alaotsikko = topic.alaotsikko.substring(0, maxTextLength_header)
            topic.aiheet?.forEach(task => {
                task.aihe = task.aihe.substring(0, maxTextLength_small)
                task.ohje = task.ohje.substring(0, maxTextLength_medium)
            })
            
        })
        
        //----------------------------------------
        const newCard = new OccasionCard({
            otsikko: createCardInfo.otsikko,
            vuosi: createCardInfo.vuosi,
            aiheet: aiheet_trimmed? aiheet_trimmed : [],
        })
        let it = await newCard.save()
        return it
        
    }catch(error){
        return undefined;
    }
}

// for pro to get the token to a feedbacklink
router.get('/link/:id', async (req, res) => {
    try {        
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (!req.token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const palauteID = req.params.id
        const palauteTokenInfo = {
            palauteID: palauteID
        }
        //const palauteToken = jwt.sign(palauteTokenInfo, process.env.PALAUTETOKENSECRET, config.palauteTokenOptions)
        const palauteToken = jwt.sign(palauteTokenInfo, process.env.PALAUTETOKENSECRET)
        res.status(200).send(palauteToken)

    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})

//Create new card
//if id is specified, then use the card with that id as a base and throw the rest of the body away
//Create copy of an occasion card, while storing original topic and tasks object_ids in original_id field
router.post('/', async (request, response, next) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const foundProGroup = await ProGroup.findOne({user: decodedToken.id})
        if(foundProGroup.occasions.length > maxOccasionCount) {
            return response.status(401).json({ error: 'Occasions limit reached' })
        }
        
        //----------------------------------------
        const groupOwner = await User.findOne({ _id: decodedToken.id })
        const palaute = new FeedBack({})
        const savedPalaute = await palaute.save()

        const parentCard_id = request.body.card_id
        if(parentCard_id){ //if parentCard is specified when card is created and not modified, then don't create a copy yet,
            
            const currentOccasions = await ProGroupOccasion.find().where('_id').in(foundProGroup.occasions).exec();


            //@Note, custom cards don't have alkuperainenKortti set
            if(currentOccasions?.filter(it => it.alkuperainenKortti?.toString() === parentCard_id).length){
                return response.status(401).json({ error: "OccasionCard already in use"});
            }

            //----------------------------------------
            //Create card copy
            const parentCard = await OccasionCard.findOne({_id: parentCard_id});
            if(!parentCard){ //Card not found
                response.status(404).json(undefined)
            }
            
            //----------------------------------------
            //Create occasion for the card
            const newOccasion = new ProGroupOccasion({
                ...createEmptyOccasion(),
                alkuperainenKortti:  parentCard_id,
                user: decodedToken.id,   
                palaute: savedPalaute._id,                 
            })
            const savedOccasion = await newOccasion.save()
            //----------------------------------------
            //save occasion to groups occasions
            foundProGroup.occasions.push(savedOccasion._id);
            await foundProGroup.save();

            const populatedOccasion = populateOccasionStructure(savedOccasion.toJSON(), parentCard.toJSON(), [])
            response.status(201).json({...populatedOccasion, alkuperainenKortti: parentCard.toJSON()})
            
        }else{ //Custom card
            const createInfo = {
                ...request.body,
                vuosi: foundProGroup.vuosi,    
            };
            
            const customCard = await createCustomOccasionCard(createInfo);

            //Create occasion for the card            
            const newOccasion = new ProGroupOccasion({
                user: decodedToken.id,
                muokattuKortti: customCard._id,
                ...createCustomOccasion(request.body),
                muokattu: true,
                palaute: savedPalaute._id,
            })
            const savedOccasion = await newOccasion.save()
            //----------------------------------------
            //save occasion to groups occasions
            foundProGroup.occasions.push(savedOccasion._id);
            await foundProGroup.save();

            const populatedOccasion = populateOccasionStructure(savedOccasion.toJSON(), customCard.toJSON(), [])
            response.status(201).json({...populatedOccasion,
                                       alkuperainenKortti: customCard,
                                       muokattuKortti: customCard});
        }
        
        return response.status(404)
    } catch (error) {
        console.log(error)
        return response.status(401).json({ error: 'unauthorized' })
    }
})

// USER CAN REMOVE OCCASIONS 
router.delete('/:id', async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (!req.token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }

        const foundGroup = await ProGroup.findOne({ user: decodedToken.id })
        if (foundGroup.user.toString() !== decodedToken.id.toString()) {          
            return res.status(401).json({ error: 'Vain pienryhmänomistaja voi poistaa ohjauskertoja' })
        }

        const occasion_id = req.params.id
        const occasion = await ProGroupOccasion.findById(occasion_id)

        //@NOTE
        //Since returned cards can't be deleted and only returned cards have archive data, we don't have to worry about archive data.
                
        await FeedBack.findByIdAndRemove(occasion.palaute)

        if(occasion.muokattuKortti){
            OccasionCard.findByIdAndRemove(occasion.muokattuKortti)
        }

        foundGroup.occasions = foundGroup.occasions.filter(b => b._id.toString() !== occasion._id.toString())
        
        await foundGroup.save()
        await occasion.remove()

        //@ Why do we return the occasion? Just to remove it from from the frontend state?
        // If so we should just send the id and not the whole object. H Peteri 2022
        res.status(200).json(occasion)

    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})


//@return and modify occasion card
router.put('/:id', async (req, res) => {
    try{
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const filter = { user: decodedToken.id }
        if (!req.token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        
        const foundProGroup = await ProGroup.findOne({ user: decodedToken.id })
                                    .populate({ path: "students", model: Student }) //get student names and ids
        if (foundProGroup.user.toString() !== decodedToken.id.toString()) {          
            return res.status(401).json({ error: 'Vain pienryhmänomistaja voi poistaa ohjauskertoja' })
        }
        const occasionCreateInfo = {
            ...req.body,
            kesto: isNaN(req.body.kesto) ? 0 : Math.round(req.body.kesto),
            sisallytysKesto: isNaN(req.body.sisallytysKesto) ? 0 : Math.round(req.body.sisallytysKesto),
            paikalla: req.body.paikalla.map(student => student.id),
            muokkaus: req.body.muokkaus ? req.body.muokkaus.substring(0, largeTextfield) : "",
            toiveet: req.body.toiveet ? req.body.toiveet.substring(0, largeTextfield) : "",
            kotitehtava: req.body.kotitehtava ? req.body.kotitehtava.substring(0, largeTextfield) : "",
        }
        
        const foundOccasion = await ProGroupOccasion.findById(occasionCreateInfo.id);
        const palaute = await FeedBack.findById(foundOccasion.palaute);
        
        let muokattuKortti = undefined
        
        //custom cards don't have original cards
        const alkuperainenKortti = await OccasionCard.findById(foundOccasion.alkuperainenKortti? foundOccasion.alkuperainenKortti : foundOccasion.muokattuKortti)
        
        //@Frontend doesn't seem to set this when returning a modified card.
        occasionCreateInfo.muokattu = occasionCreateInfo.muokattu || (foundOccasion.muokattuKortti !== undefined && foundOccasion.muokattuKortti !== null);
                
        if(occasionCreateInfo.muokattu){
            if(!foundOccasion.muokattuKortti){
                //console.log("Luodaan muokattu versio")
                muokattuKortti = await createOccasionCardAndSave(alkuperainenKortti.otsikko, occasionCreateInfo.aiheet, foundProGroup.vuosi)
            }else{
                //console.log("muokattu kortti on jo")
                muokattuKortti = await OccasionCard.findById(foundOccasion.muokattuKortti)


                //----------------------------------------
                //Remamp completed task ids to updated occasion card if original id is not present
                muokattuKortti.aiheet = occasionCreateInfo.aiheet;
                muokattuKortti = await muokattuKortti.save();
                
                let suoritetutAiheet = [];
                for(const [topic_idx, topic] of Object.entries(occasionCreateInfo.aiheet)){
                    for(const [task_idx, task] of Object.entries(topic.aiheet)){
                        if(task.original_id === undefined){
                            task.id = muokattuKortti.aiheet[topic_idx].aiheet[task_idx].id.toString();
                            occasionCreateInfo.aiheet[topic_idx].aiheet[task_idx].id;
                        }
                        
                        //console.log(task.aihe, "->", task.original_id, "->", task.id);
                    }
                }
                
                
            }
        }else{
            console.log("korttia ei ole muokattu");
        }
        const updatedOccasion = ({
            ...foundOccasion.toJSON(),
            muokattuKortti: muokattuKortti? muokattuKortti._id : foundOccasion.muokattuKortti,
            ...createCustomOccasion(occasionCreateInfo)
        })
        await ProGroupOccasion.findByIdAndUpdate(occasionCreateInfo.id,
                                                 updatedOccasion)

        //populateOccasionStructure() expects palaute to be filled, since it is returned back to the user
        
        updatedOccasion.palaute = palaute;
        const populatedOccasion = populateOccasionStructure(updatedOccasion,
                                                            muokattuKortti ? muokattuKortti.toJSON() :  alkuperainenKortti.toJSON(),
                                                            foundProGroup.students)
        
                
        return res.status(200).json({...populatedOccasion,
                                     alkuperainenKortti: alkuperainenKortti ? alkuperainenKortti.toJSON() : muokattuKortti,
                                     muokattuKortti: muokattuKortti? muokattuKortti : undefined,
                                    })
        
    }catch(error){
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})

module.exports = {
    router,
    createEmptyOccasion,
    createCustomOccasion,
    populateOccasionStructure,
    createCustomOccasionCard,
}
