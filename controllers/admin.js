const mongoose = require('mongoose'); //convert string to objectID
const router = require('express').Router()
const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Student = require('../models/student')
const FeedBack = require('../models/feedBack')
const config = require('../utils/config')

//----------------------------------------
//For /convert endpoint
const proOccasions = require('../utils/proCards') // Creates first 9 premade occasions for group
const fmOccasions = require('../utils/fmCards')
const kummiOccasions = require('../utils/kummicards')

const Occasion = require('../models/occasion')
const Group = require('../models/group')
//----------------------------------------
//models
const ProGroup = require("../models/proGroup.js") 
const ProGroupOccasion = require("../models/proGroupOccasion.js") 
const OccasionCard = require("../models/occasionCard.js")
const DefaultOccasionCardSet = require("../models/defaultOccasionCardSet.js")

const OccasionCard_Archive = require("../models/occasionCard_Archive.js")
const ProGroup_Archive = require("../models/proGroup_Archive.js")

const {createCustomOccasion, populateOccasionStructure, createCustomOccasionCard} = require("./occasion.js")
const {createDefaultCardSets} = require("./group.js")
//----------------------------------------
const saltRounds = 10

const maxTextLength_header = config.textFieldSizes.headerLength
const maxTextLength_small = config.textFieldSizes.smallTextfield
const maxTextLength_medium = config.textFieldSizes.mediumTextfield

// Edit users username and name
router.put("/editpro", async (req, res) => {
    try {
        const body = req.body
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const admin = await User.findById(decodedToken.id)
        if (admin.role !== "admin") {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
        const userToUpdate = await User.findById(body.id)

        //Username is the same, so we don't want to search for for collisions from the database
        if (userToUpdate.username === body.username) {
            userToUpdate.name = body.name
            const savedUser = await userToUpdate.save()
            res.json(savedUser)
        } else {
            const usernameExists = await User.findOne({ username: body.username })
            if (usernameExists) { //don't update, send back the original user

                //@TODO: THIS SHOULD RETURN status(409).json({error: })
                
                res.json(userToUpdate)
            } else {
                //update username and name since the wanted username is not in use
                userToUpdate.username = body.username
                userToUpdate.name     = body.name
                
                const savedUser = await userToUpdate.save()

                res.json(savedUser)
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})
// Update users special status
router.put("/special/", async (req, res) => {
    // endpoint to give special permission to user (superpro)
    try {
        const body = req.body
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const admin = await User.findById(decodedToken.id)
        if (admin.role !== "admin") {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
        const userToUpdate = await User.findById(body.id)
        userToUpdate.special = body.special
        const savedUser = await userToUpdate.save()
        res.json(savedUser)
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})
/*
router.get("/special/", async (req, res) => {
    try {
        const body = req.body
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const admin = await User.findById(decodedToken.id)
        if (admin.role !== "admin") {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
        const testMode = await User.find({special: "test"})
        testMode.length > 0 ? res.json(true) : res.json(false)
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})
*/

// Get every user
router.get("/", async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const adminUser = await User.findById(decodedToken.id)
        if (adminUser.role === 'admin') {
            const allUsers = await User.find({ _id: { $ne: decodedToken.id } })

            let all = allUsers.map(user => user.toJSON())
            res.json(all)
        } else {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})

// tyhjentää kannan muista kuin administa
router.delete("/delete", async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const adminUser = await User.findById(decodedToken.id)
        if (adminUser.role === 'admin') {
            await User.deleteMany({ _id: { $ne: decodedToken.id } })

            //@@ DEPTRECATE THIS, when we no longer need to mess with the old dump
            await Occasion.deleteMany({})
            await Group.deleteMany({})
            //
            await Student.deleteMany({})
            await FeedBack.deleteMany({})

            //----------------------------------------
            await ProGroup.deleteMany({})
            await ProGroupOccasion.deleteMany({})            

            //await OccasionCard.deleteMany({})
            //await DefaultOccasionCardSet.deleteMany({})
            //----------------------------------------
            //THIS SHOULD NOT BE HERE, BUT AS QUICK HACK TO CREATE CARDS AFTER CLEARING IF CARDSET IS NOT FOUND IN THE 
            
            await createDefaultCardSets();
            return res.status(204).end();
            
        } else {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})

// palauttaa muokatut occasionit
router.get("/edited", async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        if (user.role !== "admin") {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
        const editedOccasions = await ProGroupOccasion.find({ muokattu: true})
              .populate({path: "alkuperainenKortti", model: OccasionCard})
              .populate({path: "muokattuKortti", model: OccasionCard})

        //@NOTE card names can't be modified, so returning the modified name is fine.
        //this has to change if we want to allow changes to card titles. H.Peteri 2022
        const result = editedOccasions.map(it => ( {
            id: it._id.toString(),
            otsikko: it.muokattuKortti.otsikko,
            muokkaus: it.muokkaus,
        }))
        
        res.json(result)
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})

// Delete user based on id.
//!!! also deletes archive data for that user !!!
router.delete("/:id", async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const admin = await User.findById(decodedToken.id)
        if (admin.role !== "admin") {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
        const toRemove_user = await User.findByIdAndDelete(req.params.id)
        
        const toRemove_occasions = await ProGroupOccasion.find({ user: toRemove_user })
        if(toRemove_occasions.length)
            await ProGroupOccasion.deleteMany({ _id: { $in: toRemove_occasions}})
        
        const toRemove_group = await ProGroup.findByIdAndDelete(toRemove_user.group)
        const toRemove_cards = toRemove_occasions.map(occ => occ.muokattuKortti).filter(kortti => kortti)
        if(toRemove_cards.length){
            //@NOTE We don't currently* archive custom cards, so we don't have to delete card archives since there is only the ones for default cards. 
            await OccasionCard.deleteMany({ _id: { $in: toRemove_cards}})
        }
        const toRemove_feedback = toRemove_occasions.map(occ => occ.palaute)
        if(toRemove_feedback.length)
            await FeedBack.deleteMany({ _id: { $in: toRemove_feedback}})

        //Remove archive of the group
        await ProGroup_Archive.findOneAndDelete({group: toRemove_user.group});
        
        
        if(toRemove_group?.students.length){
            await Student.deleteMany({ _id: { $in: toRemove_group.students}})
        }
        res.status(204).end()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})

const archiveOccasionCard = async (card_id, expected_role, keepPersonalInfo) => {
    try{
        const card = await OccasionCard.findById(card_id).exec();
        const foundOccasions = await ProGroupOccasion.find({alkuperainenKortti: card_id, suoritettu: true})
              .populate({ path: "user", model: User, select: "science"}) //we don't care about instructors actual username
              .populate({ path: "palaute", model: FeedBack}) //we don't care about instructors actual username
              .populate({ path: "muokattuKortti", model: OccasionCard})
              .exec();
        
        const occasions = foundOccasions.map(occ => occ.toJSON())
        
        let perScience = new Map();

        //Archive every occasion from every science
        for(const [idx, occ] of occasions.entries()){

            //We need to clamp participation to the current student count in the group
            const group = await ProGroup.findOne({user: occ.user.id});
            
            let it = perScience[occ.user.science]
            if(!it){ //Create empty structure for science
                perScience[occ.user.science] = {
                    science: occ.user.science,
                    palautukset_lkm: 0,
                    muokkaukset_lkm: 0,
                    paikalla_lkm: 0,
                    paikalla_min: 0,
                    paikalla_max: 0,
                    kesto_yht: 0,
                    kesto_min: 0,
                    kesto_max: 0,
                    muokatutKortit: [],
                    palaute: {
                        needsimproving: 0,
                        ok:             0,
                        good:           0,
                        feedbacktexts_perOccasion: [],
                    },
                    aiheet: [],
                    lisaAiheet: [],
                    muokkaukset: [],
                }

                it = perScience[occ.user.science]
                
                //copy card to aiheet
                for(const topic of card.aiheet){
                    let newTopic = {
                        muokattu_lkm: 0,
                        poistettu_lkm: 0,
                        aiheet: [],
                    };
                    for(const task of topic.aiheet){
                        newTopic.aiheet.push({
                            muokattu_lkm: 0,
                            poistettu_lkm: 0,
                            suoritettu_lkm: 0,
                        })
                    }
                    it.aiheet.push(newTopic);        
                }

                if(occ.lisaAiheet?.length){
                    it.lisaAiheet.push({
                        lisaAiheet: occ.lisaAiheet,
                        card_id: occ.muokattuKortti ? occ.muokattuKortti._id : card._id,
                        occasion_id: occ.id,
                    });
                }
                if(occ.muokkaus?.length){
                    it.muokkaukset.push({
                        muokkaus: occ.muokkaus,
                        card_id: occ.muokattuKortti ? occ.muokattuKortti._id : card._id,
                        occasion_id: occ.id,
                    });
                }
            }
            
            it.palautukset_lkm += 1
            
            if(occ.muokattuKortti){
                it.muokkaukset_lkm += 1
                it.muokatutKortit.push(foundOccasions[idx].muokattuKortti._id)
            }

            
            //@NOTE since we don't update every occasion after user updates their student count, the occasion might have students in the participated array which are no longer in the group
            //so we need to count the student which are in both arrays
            const paikalla_lkm =  occ.paikalla.filter(student_0 => 
                group.students.find(student_1 => student_0.toString() === student_1.toString())
            ).length;
            

            it.paikalla_lkm += paikalla_lkm;
            if(it.paikalla_min === 0){
                it.paikalla_min = paikalla_lkm;
            }
            it.paikalla_min = Math.min(it.paikalla_min, paikalla_lkm);
            it.paikalla_max = Math.max(it.paikalla_max, paikalla_lkm);
            

            it.kesto_yht += occ.kesto;
            if(it.kesto_min === 0){
                it.kesto_min = occ.kesto
            }
            it.kesto_min = Math.min(it.kesto_min, occ.kesto);
            it.kesto_max = Math.max(it.kesto_max, occ.kesto);
            
            
            //----------------------------------------
            //feedback
            it.palaute.needsimproving += occ.palaute.needsimproving;
            it.palaute.ok += occ.palaute.ok;
            it.palaute.good += occ.palaute.good;
            
            if(occ.palaute.feedbacktexts.length){
                it.palaute.feedbacktexts_perOccasion.push({feedbacktexts: [...occ.palaute.feedbacktexts],
                                                           occasion_id: occ.id});
            }
            //----------------------------------------
            //update tasks and topics info. how many modifications, deletions and completions
            const populatedOccasion = populateOccasionStructure(occ,
                                                                occ.muokattuKortti ? occ.muokattuKortti : card.toJSON(),
                                                                [])

            
            for(const [topic_idx, topic] of card.aiheet.entries()){
                const topic_occ = populatedOccasion.aiheet?.find(it => it.id === topic._id.toString() || it.original_id === topic._id.toString());
                
                if(!topic_occ){ //Update deletion count for topic.
                    it.aiheet[topic_idx].poistettu_lkm += 1;
                    //@NOTE Consider each task under the topic to be deleted
                    it.aiheet[topic_idx].aiheet.forEach(aihe => aihe.poistettu_lkm  += 1);

                }else if(topic_occ.alaotsikko !== topic.alaotsikko){
                    it.aiheet[topic_idx].muokattu_lkm += 1;
                }

                //Skip since we can't match any tasks
                if(!topic_occ){
                    continue;
                }
                
                for(const [task_idx, task] of topic.aiheet.entries()){
                    task_occ = topic_occ.aiheet.find(it => it.id === task._id.toString() || it.original_id === task._id.toString());

                    if(!task_occ){
                        it.aiheet[topic_idx].aiheet[task_idx].poistettu_lkm += 1
                    }else{
                        if(task_occ.aihe !== task.aihe ||  task_occ.ohje !== task.ohje){
                            it.aiheet[topic_idx].aiheet[task_idx].muokattu_lkm += 1
                        }
                        if(task_occ.lapikayty){
                            it.aiheet[topic_idx].aiheet[task_idx].suoritettu_lkm += 1
                        }                        
                    }
                }
            }
        }
        
        
        const archive = await OccasionCard_Archive.findOne({alkuperainenKortti: card_id});
        let ps = [];
        for(m in perScience)
            ps.push(perScience[m]);
        
        if(!archive){
            const saved = await new OccasionCard_Archive({
                vuosi: card.vuosi,
                archived_date: new Date(),
                expected_role: expected_role,
                alkuperainenKortti: card_id,
                perScience: ps,
            }).save();
            
        }else{
            const saved = await OccasionCard_Archive.findByIdAndUpdate(archive._id, {archived_date: new Date(), perScience: ps});
        }
    }catch(error){
        console.log(error)
    }    
}
const archiveProGroup = async (group, archiveName) => {
    
    try{
        const createInfo = group.occasions.reduce((res, occ) => {
            if(occ.suoritettu){
                res.ohjauskerrat_lkm += 1;
                
                res.kesto_yht += occ.kesto;
                if(res.kesto_min === 0){
                    res.kesto_min = occ.kesto
                }
                res.kesto_min = Math.min(res.kesto_min, occ.kesto);
                res.kesto_max = Math.max(res.kesto_max, occ.kesto);


                //@NOTE since we don't update every occasion after user updates their student count, the occasion might have students in the participated array which are no longer in the group
                //So we have to match the participation ids to the current students in the group. Otherwise overview page would have participation-% over 100%.  H Peteri 2022
                const paikalla_lkm =  occ.paikalla.filter(student_0 => 
                    group.students.find(student_1 => student_0.toString() === student_1.toString())
                ).length;


                res.paikalla_lkm += paikalla_lkm;
                if(res.paikalla_min === 0){
                    res.paikalla_min = paikalla_lkm;
                }
                res.paikalla_min = Math.min(res.paikalla_min, paikalla_lkm);
                res.paikalla_max = Math.max(res.paikalla_max, paikalla_lkm);

                
                if(occ.alkuperainenKortti){
                    if(occ.muokattuKortti)
                        res.muokatutKortit.push(occ.muokattuKortti)
                    else
                        res.alkuperaisetKortit.push(occ.alkuperainenKortti.id)
                }else{
                    res.omatKortit.push(occ.muokattuKortti)
                }
                res.occasions.push({date: occ.date,
                                    isCardModified: occ.muokattu,
                                    isCardCustom: occ.alkuperainenKortti ? false : true,
                                    cardName: occ.alkuperainenKortti? occ.alkuperainenKortti.otsikko : occ.muokattuKortti.otsikko,
                                    occasion_id: occ._id})
            }
            res.palaute.needsimproving += occ.palaute.needsimproving
            res.palaute.ok += occ.palaute.ok
            res.palaute.good += occ.palaute.good
            
            if(occ.palaute.feedbacktexts.length){
                res.palaute.feedbacktexts_perOccasion.push({feedbacktexts: [...occ.palaute.feedbacktexts],
                                                           occasion_id: occ.id});
            }
            
            return res
        }, {
            archiveName: archiveName,
            ohjauskerrat_lkm: 0,
            kesto_yht: 0,
            kesto_min: 0,
            kesto_max: 0,
            paikalla_lkm: 0,
            paikalla_min: 0,
            paikalla_max: 0,
            oppilaat_lkm: group.students.length,
            role: group.user.role,
            special: group.user.special,
            intScience: group.user.intScience,
            alkuperaisetKortit: [],
            muokatutKortit: [],
            omatKortit: [],
            occasions: [],
            palaute: {
                needsimproving: 0,
                ok: 0,
                good: 0,
                feedbacktexts_perOccasion: [],
            }})

        //--------------------
        //save or update
        const archive = await ProGroup_Archive.findOne({group: group._id})

        if(!archive){
            const saved = await new ProGroup_Archive({
                group: group._id,
                vuosi: group.vuosi? group.vuosi : 2021, //groups should have year, but old model doesn't have it yet, so use the current year //H. Peteri 2022
                archived_date: new Date(),
                science: group.science,
                ...createInfo                
            }).save()
        }else{
            const saved = await ProGroup_Archive.findByIdAndUpdate(archive._id, {...createInfo, archived_date: new Date()})
        }
    }catch(error){
        console.log(error);
    }
}
const archiveTask = async () => {
    try{
        //----------------------------------------
        //Archive default cards only for now
        //@NOTE, this is dumb, we should have a clear way to get the current active year...
        const vuosi = new Date().getFullYear();
        let defaultCardSets = await DefaultOccasionCardSet.find({vuosi: vuosi}).exec();
        if(!defaultCardSets.length){
            //console.log(`${vuosi} has no card sets`);
            defaultCardSets = await DefaultOccasionCardSet.find({vuosi: vuosi - 1}).exec();
            //console.log(`${vuosi - 1} has ${defaultCardSets.length} card sets`);
           
        }
        
        //console.log(`Archiving ${defaultCardSets.length} cardsets`);
        for(let set of defaultCardSets){
            //console.log(`Archiving ${set.card_ids.length} cards for '${set.expected_role}'`);
            for(const card_id of set.card_ids){
                archiveOccasionCard(card_id, set.expected_role);
            }
        }
        //----------------------------------------
        //Archive groups
        const groups = await ProGroup.find()
              .populate({ path: "user", model: User})
              .populate({ path: "occasions", model: ProGroupOccasion,
                          populate: [{path: "palaute", model: FeedBack},
                                     {path: "alkuperainenKortti", model: OccasionCard},
                                     {path: "muokattuKortti", model: OccasionCard}]
                        })
              .exec();
        
        for(const [group_idx, group] of groups.entries()){
            //groups get deleted each year, so save an archiveName as well into the archive. This is mainly for frontend, to display some kind of name for a
            //deleted group. (group.user.name gets overwritten in superpro.js controller when getting an archive) //H Peteri 2022
            archiveProGroup(group, `archived_group_${group_idx}`);
        }
    }catch(error){
        console.log(error);
    }
}
router.post("/archive", async (req, res) => { 
    try {
        console.log("begin archive task")
        const body = req.body
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const admin = await User.findById(decodedToken.id)
        if (admin.role !== "admin") {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
        await archiveTask();
        console.log("end archive task");
        return res.status(201);
    }catch(error){
        console.log(error);
        return res.status(401).json({ error: 'unauthorized' })        
    }
})
/*
router.post("/convert", async (req, res) => {
    try {
        const body = req.body
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const admin = await User.findById(decodedToken.id)
        if (admin.role !== "admin") {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
        console.log("Convert old users to new users");
        //----------------------------------------
        //start of arrow func
        const mapCompletedTasks = (cardAiheet, oldOccasionAiheet, kohta) => {
            //maps lapikayty aihe to cards tasks id
            if(cardAiheet.length !== oldOccasionAiheet.length){  //this shouldn't be possible since the card and occasion should match
                console.log(kohta, " MapCompletedTasks aiheet array length doesn't match", cardiiheet, oldOccasionAiheet)
                return []
            }
            
            let mappedSuoritukset = [];
            

            for(let i = 0; i < oldOccasionAiheet.length; i++){
                const tasks_0 = oldOccasionAiheet[i].aiheet;
                const tasks_1 = cardAiheet[i].aiheet;
                
                if(tasks_1.length !== tasks_0.length){ //this shouldn't be possible since the card and occasion should match
                    console.log(kohta, " MapCompletedTasks tasks array length doesn't match\>tasks_0", tasks_0, "\ntasks_1->", tasks_1, "\ncardAiheet", cardAiheet, "\nocc aiheet", oldOccasionAiheet)
                    return []
                }
                
                for(let j = 0; j < tasks_0.length; j++){
                    if(tasks_0[j].lapikayty){
                        mappedSuoritukset.push(tasks_1[j]._id);
                    }                        
                }
            }
            return mappedSuoritukset;
        }
        //end of arrow func
        //----------------------------------------
        
        const allGroups = await Group.find()
              .populate({ path: 'occasions', model: Occasion})
              .populate({ path: 'user', model: User, select: '-username' })

        

        const proCards = await DefaultOccasionCardSet.findOne({expected_role: "pro"}).populate({path: "card_ids"});
        const fmCards = await DefaultOccasionCardSet.findOne({expected_role: "fmpro"}).populate({path: "card_ids"});
        const kummiCards = await DefaultOccasionCardSet.findOne({expected_role: "kummi"}).populate({path: "card_ids"});
        
        const allCards = new Map();
        allCards["pro"] = proCards.card_ids;
        allCards["fmpro"] = fmCards.card_ids;
        allCards["kummi"] = kummiCards.card_ids;

        for(const group of allGroups){
            
            let newOccasions = [];
            let completedTasks = [];
            
            //map old occasions to default cards 
            for(const occasion of group.occasions){
                const alkuperainenKortti = allCards[group.user.role].find(it => it.otsikko.substring(0, maxTextLength_header) === occasion.otsikko.substring(0, maxTextLength_header))
                let   muokattuKortti = undefined;

                if(alkuperainenKortti){
                    
                    //----------------------------------------
                    //start of arrow func
                    const mapOccasionToCard = (alkuperainenKortti, occasion) => {
                        let mappedTopics = [] 
                        let isMatch = true;
                        
                        if(alkuperainenKortti.aiheet.length !== occasion.aiheet.length)
                            isMatch = false;
                        
                        for(const aihe of occasion.aiheet){
                            const matchedAihe = alkuperainenKortti.aiheet.find(it => it.alaotsikko.substring(0, maxTextLength_header) === aihe.alaotsikko.substring(0, maxTextLength_header));

                            if(!matchedAihe)
                                isMatch = false;
                            else if(matchedAihe.aiheet.length != aihe.aiheet.length)
                                isMatch = false;
                            
                            let mappedTasks = []
                            
                            if(matchedAihe){
                                for(const task of aihe.aiheet){
                                    const matchedTask = matchedAihe.aiheet.find(it => it.aihe.substring(0, maxTextLength_small) === task.aihe.substring(0, maxTextLength_small) && it.ohje.substring(0, maxTextLength_medium) === task.ohje.substring(0, maxTextLength_medium))
                                                                        
                                    let t = {
                                        aihe: task.aihe,
                                        ohje: task.ohje,
                                        original_id: matchedTask?.id,
                                    }
                                    
                                    if(!matchedTask){
                                        isMatch = false;
                                    }                                    
                                    mappedTasks.push(t)
                                }
                            }else{
                                mappedTasks = aihe.aiheet
                            }

                            
                            let topic = {
                                alaotsikko: aihe.alaotsikko,
                                aiheet: mappedTasks,
                                original_id : matchedAihe?.id,
                            }        
                            mappedTopics.push(topic)
                        }
                        return {
                            isMatch: isMatch,
                            otsikko: occasion.otsikko,
                            aiheet: mappedTopics,
                        }
                    }
                    //End of arrow func
                    //----------------------------------------
                                        
                    const result = mapOccasionToCard(alkuperainenKortti, occasion)
                    if(!result.isMatch){
                        
                        muokattuKortti = await createCustomOccasionCard(result)
                        completedTasks = mapCompletedTasks((await OccasionCard.findById(muokattuKortti)).aiheet, occasion.aiheet, 0)
                    }else{
                        //same card can be used
                        completedTasks = mapCompletedTasks(alkuperainenKortti.aiheet, occasion.aiheet, 1)
                    }
                }else{ //cant find a card with a matching name, so create a new one
                    muokattuKortti = await createCustomOccasionCard(occasion)
                    completedTasks = mapCompletedTasks((await OccasionCard.findById(muokattuKortti)).aiheet, occasion.aiheet, 2)
                }
                
                const newOccasionData = {
                    palaute: occasion.palaute,
                    user: group.user._id,
                    ... createCustomOccasion({
                        ohjaustapa: occasion.ohjaustapa,
                        ohjauspaikka: occasion.ohjauspaikka,
                        paikalla: occasion.paikalla,
                        toiveet: occasion.toiveet,
                        kotitehtava: occasion.kotitehtava,
                        lisäAiheet: occasion.lisäAiheet, //createInfo uses ä instead of a
                        suoritettu: occasion.suoritettu,
                        muokattu: (muokattuKortti ? true : false),
                        muokkatus: occasion.muokkaus,
                        kesto: occasion.kesto,
                        date: occasion.date,
                    }),
                    muokattuKortti: muokattuKortti,
                    alkuperainenKortti: alkuperainenKortti?._id,
                    suoritetutAiheet: completedTasks,
                }

                

                const savedOccasion = await new ProGroupOccasion(newOccasionData).save();
                newOccasions.push(savedOccasion._id)
            }
            //create new proGroup
            const newGroupData = {
                science: group.user.science,
                name: group.user.name,
                students: group.students,
                occasions: newOccasions,
                user: group.user._id,
            }

            new ProGroup(newGroupData).save()
        }
        
        
        // For converting cards which don't have dates set
        // const result = await OccasionCard.updateMany({}, {vuosi: 2021});
        // console.log("occasion cards updated ", result.n );
        // console.log("done")
        
        
        await Occasion.deleteMany({})
        await Group.deleteMany({})


        return res.status(201);
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})
*/
// salasanan palautus
// @ Resets users password, based on id, to BASEPASSWORD declared in config.js
router.put("/:id", async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const admin = await User.findById(decodedToken.id)
        if (admin.role !== "admin") {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }
        const user = await User.findById(req.params.id)
        const newPasswordHash = await bcryptjs.hash(config.BASEPASSWORD, saltRounds)
        user.passwordHash = newPasswordHash
        const savedUser = await user.save()

        res.json(savedUser)
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})
module.exports = {
    router,
    archiveTask
}

