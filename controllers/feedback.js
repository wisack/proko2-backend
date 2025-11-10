const router = require('express').Router()
const FeedBack = require('../models/feedBack')
const config = require('../utils/config')

const feedBackLength = config.textFieldSizes.interMediateTextfield
const maxStudents = config.textFieldSizes.maxTopicCount //atm 30, there is about 15 students

// students can give feedback with link
router.put('/', async (req, res) => {
    try {
        const body = req.body
        console.log("feedback body", body);
        
        if (!req.feedbacktoken || !req.palauteID) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const feedback = await FeedBack.findById(req.palauteID)
        if (feedback.feedbacktexts.length >= maxStudents) {
            return res.status(401).json({ error: 'enough feedback received' })
        } else {
            if (body.needsimproving) {
                feedback.needsimproving += 1
            } else if (body.good) {
                feedback.good += 1
            } else {
                feedback.ok += 1
            }
            if (body.text.length > 0){
                feedback.feedbacktexts.push(body.text.substring(0, feedBackLength).trim())
            }
            await feedback.save()
            res.status(200).json({ message: "ok" })
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'token missing or invalid' })
    }

})

module.exports = router
