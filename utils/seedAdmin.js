const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const config = require('./config')
const logger = require('./logger')

const generateAdminUsername = (name = "Proko Admin") => {
    const date = new Date()
    const yearSuffix = date.getFullYear() % 100
    const nameArr = name.trim().split(/\s+/)
    if (nameArr.length <= 1) {
        const first = nameArr[0].charAt(0).toLowerCase() + nameArr[0].substring(1, 12).replace("-", "").replace(/ä/g, "a").replace(/ö/g, "o")
        return `${first}${yearSuffix}`.toLowerCase()
    }
    const firstInitial = nameArr[0].charAt(0).toLowerCase()
    const lastNamePart = nameArr[1].toLowerCase().replace("-", "").replace(/ä/g, "a").replace(/ö/g, "o").substring(0, 12)
    return `${firstInitial}${lastNamePart}${yearSuffix}`.toLowerCase()
}

const seedAdminUserIfNeeded = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' })
        if (!existingAdmin) {
            const adminName = "Proko Admin"
            const username = generateAdminUsername(adminName)
            const passwordHash = await bcryptjs.hash(config.BASEPASSWORD, 12)

            const newAdmin = new User({
                username: username,
                name: adminName,
                passwordHash: passwordHash,
                role: 'admin',
                science: '',
                intScience: '',
                special: '',
                language: 'fi'
            })

            await newAdmin.save()
            logger.info(`Auto-seeded initial admin user: '${adminName}' (username: '${username}')`)
        }
    } catch (error) {
        logger.error('Error auto-seeding initial admin user:', error.message)
    }
}

module.exports = {
    seedAdminUserIfNeeded,
    generateAdminUsername
}
