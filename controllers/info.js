const router = require('express').Router()
const Info = require('../models/info')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const DEFAULT_TROUBLESHOOTING_MESSAGE = `If you are having trouble while loggin in, please contact the person controlling the PROKO - application. (ADDRESS).`

// GET /api/info/troubleshooting
// Public endpoint for Login page
router.get('/troubleshooting', async (req, res) => {
    try {
        let item = await Info.findOne({ key: 'troubleshootingMessage' })
        if (!item) {
            item = new Info({
                key: 'troubleshootingMessage',
                value: DEFAULT_TROUBLESHOOTING_MESSAGE
            })
            await item.save()
        }
        res.json({ troubleshootingMessage: item.value })
    } catch (error) {
        console.error('Error fetching troubleshooting message:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

// PUT /api/info/troubleshooting
// Admin endpoint to update troubleshooting message
router.put('/troubleshooting', async (req, res) => {
    try {
        if (!req.token) {
            return res.status(401).json({ error: 'Token puuttuu' })
        }
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        const admin = await User.findById(decodedToken.id)
        if (!admin || admin.role !== 'admin') {
            return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
        }

        const { troubleshootingMessage } = req.body
        if (typeof troubleshootingMessage !== 'string') {
            return res.status(400).json({ error: 'Virheellinen viesti' })
        }

        let item = await Info.findOne({ key: 'troubleshootingMessage' })
        if (!item) {
            item = new Info({
                key: 'troubleshootingMessage',
                value: troubleshootingMessage
            })
        } else {
            item.value = troubleshootingMessage
        }

        const savedItem = await item.save()
        res.json({ troubleshootingMessage: savedItem.value })
    } catch (error) {
        console.error('Error updating troubleshooting message:', error)
        res.status(500).json({ error: error.message || 'Server error' })
    }
})

module.exports = router
