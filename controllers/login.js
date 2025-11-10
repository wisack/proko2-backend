const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

const maxHeaderLength = config.textFieldSizes.headerLength      //otsikot, alaotsikot, password

loginRouter.post('/', async (request, response) => {
    const body = request.body
        
    const user = await User.findOne({ username: body.username.substring(0, maxHeaderLength) })
    const passwordCorrect = user === null
          ? false
          : await bcryptjs.compare(body.password.substring(0, maxHeaderLength), user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({error: 'Wrong username or password'})
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    user.logins = user.logins + 1
    await user.save()

    const token = jwt.sign(userForToken, process.env.SECRET, config.tokenOptions)
    response
        .status(200)
        .send({
            token,
            username: user.username,
            name: user.name,
            role: user.role,
            science: user.science,
            intScience: user.intScience,
            group: user.group,
            language: user.language,
            special: user.special,
            id: user._id.toString(),
            logins: user.logins
        })
})

module.exports = loginRouter
