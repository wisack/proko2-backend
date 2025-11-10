const router = require('express').Router()
const User = require('../models/user')
const Announcement = require('../models/announcement')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

router.post('/announcement', async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        const body = req.body

        console.log(body);
        
        //Default to user science. If user is special, then use sciences field if it is used
        let sciences = user.science; 
        if(user.special === "dekaani" && body.sciences.length > 0){
            sciences = body.sciences
        }
        const announcement = new Announcement({
            message: body.message.substring(0, config.textFieldSizes.smallTextfield),
            sender: user,
            date: new Date(),
            receiverRole: body?.receiverRole ? body.receiverRole : 'all',
            sciences: sciences
        })
        const savedAnnouncement = await announcement.save()
        return res.status(200).json(savedAnnouncement)

    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'token missing or invalid' })
    }
})
router.get('/announcement', async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        console.log("get", req.body);
        let announcements
        if (user.special === "dekaani") {
            
            //@@TODO, removal shouldn't happen here
            const dateLimit = new Date()
            const days = 14     //tätä vanhemmat poistetaan
            dateLimit.setDate(dateLimit.getDate() - days)
            await Announcement.deleteMany({ date: { $lt: dateLimit } })
            announcements = await Announcement.find({}).populate({ path: 'sender', select: 'name role science special' })
        } else if (user.role === "superpro") {
            announcements = await Announcement.find({ sciences: user.science }).populate({ path: 'sender', select: 'name role science special' })
        } else {
            const temp = await Announcement.find({ sciences: user.science }).populate({ path: 'sender', select: 'name role science special' })
            announcements = temp.filter(a => a.receiverRole !== "superpro")
        }

        const result = announcements.map((it) => it.toJSON());
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'token missing or invalid' })
    }
})

router.delete('/announcement/:id', async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const announcement = await Announcement.findById(req.params.id).populate("sender")
                
        if (announcement?.sender?.id === decodedToken.id) {
            announcement.remove()
            return res.status(200).json(announcement)
        }
        return res.status(401).json({error: "unauthorized"})
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'token missing or invalid' })
    }
})

module.exports = router
