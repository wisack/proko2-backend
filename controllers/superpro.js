const router = require('express').Router()
const Group = require('../models/group')
const User = require('../models/user')
const Occasion = require('../models/occasion')
const jwt = require('jsonwebtoken')

const groupController = require("./group.js")

const ProGroup = require("../models/proGroup.js")

const OccasionCard_Archive = require("../models/occasionCard_Archive.js")
const ProGroup_Archive = require("../models/proGroup_Archive.js")

const isUserDekaaniOrAdmin = (user) => {
    return user.special === "dekaani" || user.role === "admin";
}
//get all groups base on requested science
//@ returns array of groups
router.get('/', async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        if (user.role !== "superpro") {
            return res.status(401).json({ error: 'Et ole tiedekunnan SuperPRO' })
        }
        //----------------------------------------
        const allGroups = await ProGroup.find({ science: user.science })
        const proGroups = await groupController.populateProGroupStructure_Array(allGroups.map(g => g.user))
        //----------------------------------------
        return res.status(200).json(proGroups)
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})

//oman tiedekunnan sisäistä tarkastelua varten esim dekaanille
router.get('/extras', async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        if (user.role !== "superpro") {
            return res.status(401).json({ error: 'Not authenticated' })
        }

        if (user.special !== "dekaani") {
            return res.status(201).json([])
        }
        
        //----------------------------------------
        const allGroups = await ProGroup.find({ science: {$ne: user.science }})
        const proGroups = await groupController.populateProGroupStructure_Array(allGroups.map(g => g.user))
        //----------------------------------------                       
        return res.status(200).json(proGroups)

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            error: 'unauthorized'
        })
    }
})

//Returns archive data for a specific year
router.get("/archive/:vuosi", async(req, res) => {
    try{
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        if(user.role !== "superpro" && user.role !== "admin") {
            return res.status(401).json({error: "unauthorized"})
        }
        //----------------------------------------
        let result_cards = await OccasionCard_Archive.find({vuosi: req.params.vuosi}).populate("alkuperainenKortti");
        
        result_cards = result_cards.map(it => it.toJSON());

        //if user is not dekaani or admin, we only want card archive for the same science
        if(!isUserDekaaniOrAdmin(user)){
            result_cards.forEach(it => it.perScience = it.perScience.filter(science => science.science === user.science));
        };

        //same this for pro groups, limit to same science if not enough privileges
        const filter = isUserDekaaniOrAdmin(user) ? {vuosi: req.params.vuosi} : {vuosi: req.params.vuosi, science: user.science};
        const result_groups = await ProGroup_Archive.find(filter).populate({path: "group", model: ProGroup, select: "user _id",
                                                                            populate: {path: "user", model: User, select: "name" }})
        
        const groupsByScience = {};
        result_groups.forEach(it => {
            it = it.toJSON();

            //if not found, create empty array for sciences
            if(!groupsByScience[it.science]){
                groupsByScience[it.science] = []
            }

            //handle removed group, use archiveName, this also acts as personal information removal
            if(!it.group){
                it.group = {user: {name: it.archiveName}}
            }

            groupsByScience[it.science].push(it)
        })
        //----------------------------------------
        const result = {
            cards: result_cards,
            groups: groupsByScience,
        };
        return res.status(200).json(result)
    }catch(error){
        console.log(error);
        return res.status(401).json({error: "unauthorized"})        
    }

})
module.exports = router
