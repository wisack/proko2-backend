const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const KoulutusInfo = require('../models/koulutusinfo')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { v4: uuidv4 } = require('uuid');
const saltRounds = 12
const maxPasswordLength = config.textFieldSizes.headerLength

// uuden käyttäjän luominen
usersRouter.post('/', async (request, response) => {
    
    try {
        const body = request.body
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const adminUser = await User.findById(decodedToken.id)
        const isAdmin = adminUser?.role === 'admin'
        // Vain admin voi tehdä lisää käyttäjiä
        if (!isAdmin) {
            return response.status(401).json({error: "unauthorized"})
        }
        console.log("Creating user", body.name)
        const passwordHash = await bcryptjs.hash(config.BASEPASSWORD, saltRounds)
        const speciality = body.special === undefined ? "" : body.special;

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
            science: body.science,
            role: body.role,
            special: speciality,
            intScience: body.intScience || "",
            language: body.role === 'kummi' ? "en" : "fi"
        })

        if (user.role === 'admin' || user.role === 'superpro') {
            delete user.group
        }
        const usernameExists = await User.findOne({ username: body.username })
        if (usernameExists) {
            user.username = user.username + '-coll' + uuidv4()
        }
        const savedUser = await user.save()
        response.json(savedUser)

    } catch (error) {
        console.log(error)
        return response.status(401).json({error: 'unauthorized'})
    }
})

// käyttäjän kielen vaihtaminen
usersRouter.post('/language', async (req, res) => {
    try {
        const body = req.body
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (decodedToken) {
            const user = await User.findByIdAndUpdate(decodedToken.id, { language: body.language }).select('-username')
            return res.status(200).json(user)
        } else {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'token missing or invalid' })
    }
})


// salasanan vaihto
usersRouter.put('/', async (req, res) => {
    try {
        const body = req.body
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (!decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        const passwordCorrect = user ? await bcryptjs.compare(body.oldPassword, user.passwordHash) : false;
        if (!passwordCorrect) {
            return res.status(401).json({ error: 'Vanha salasana kirjoitettu väärin!' })
        }
        const newPasswordHash = await bcryptjs.hash(body.newPassword.substring(0, maxPasswordLength), saltRounds)
        user.passwordHash = newPasswordHash
        const savedUser = await user.save()
        return res.status(200).json(savedUser)
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'unauthorized' })
    }
})
usersRouter.get('/refresh', async (request, response) => {
    try {
        const verifiedToken = jwt.verify(request.token, process.env.SECRET)
        const user = await User.findById(verifiedToken.id)
        const userForToken = {
            username: user.username,
            id: user._id,
        }
        const token = jwt.sign(userForToken, process.env.SECRET, config.tokenOptions)
        return response.status(200).send({ //token,
                                            username: user.username,
                                            name: user.name,
                                            role: user.role,
                                            science: user.science,
                                            group: user.group,
                                            language: user.language,
                                            special: user.special,
                                            intScience: user.intScience,
                                            planning: user.planning,
                                            //koulutuksetKesto: user.koulutuksetKesto,
                                            koulutukset: user.koulutukset,
                                            suunnitelma: user.suunnitelma,
                                            id: user._id })

    } catch (error) {
        console.log(error)
        return response.status(401).json({ error: 'Not verified' })
    }
})

/*
usersRouter.post('/traininghours', async (req, res) => {
    try {
        const body = req.body
        
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (decodedToken) {
            let existing = await User.findById(decodedToken.id)
            existing.koulutuksetKesto[body.indeksi] = body.numInput
            const user = await User.findByIdAndUpdate(decodedToken.id, { koulutuksetKesto: existing.koulutuksetKesto})
            return res.status(200).json(user)
        } else {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'token missing or invalid' })
    }
})
*/
usersRouter.post('/traininghours', async (req, res) => {
  try {
    const { selectedLanguage, idx, actualizedBilling } = req.body;

    if (!req.token) {
      return res.status(401).json({ error: 'Token missing or invalid' });
    }
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const koulutusInfo = await KoulutusInfo.findOne({ selectedLanguage });
    if (!koulutusInfo || !koulutusInfo.koulutukset[idx]) {
      return res.status(404).json({ error: 'Koulutus not found' });
    }

    const baseKoulutus = koulutusInfo.koulutukset[idx];
    const newUserKoulutus = {
    koulutusId: baseKoulutus._id,
    tapahtuma: baseKoulutus.tapahtuma,
    laskutus: baseKoulutus.laskutus,
    actualizedBilling,
    };

    const existing = user.koulutukset.find((k) => k.koulutusId.toString() === baseKoulutus._id.toString());
    if (existing) {
        // Update the existing entry
        existing.actualizedBilling = newUserKoulutus.actualizedBilling;
        existing.laskutus = newUserKoulutus.laskutus;
        existing.tapahtuma = newUserKoulutus.tapahtuma;
        } else {
        // Otherwise push as a new one
        user.koulutukset.push(newUserKoulutus);
        }

    await user.save();
    res.status(200).json({ message: 'Koulutus added to user successfully', koulutus: newUserKoulutus });
  } catch (error) {
    console.error('Error adding user koulutus:', error);
    res.status(500).json({ error: 'Failed to add koulutus to user' });
  }
});

usersRouter.post('/planning', async (req, res) => {
    try {
        const body = req.body
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (decodedToken) {
            const user = await User.findByIdAndUpdate(decodedToken.id, { planning: body.planning }).select('-username')
            return res.status(200).json(user)
        } else {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'token missing or invalid' })
    }
})

usersRouter.post('/suunnitelma', async (req, res) => {
    try {
        const body = req.body
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (decodedToken) {
            const user = await User.findByIdAndUpdate(decodedToken.id, { suunnitelma: body.suunnitelma }).select('-username')
            return res.status(200).json(user)
        } else {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'token missing or invalid' })
    }
})

module.exports = usersRouter
