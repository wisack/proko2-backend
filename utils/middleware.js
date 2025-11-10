const logger = require('./logger')
const jwt = require('jsonwebtoken')
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const config = require('./config')
const MAXLENGTH = 50

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    const feedbackauth = request.get('feedbackauth')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    if (feedbackauth && feedbackauth.toLowerCase().startsWith('feedbackauth ')) {
        request.feedbacktoken = feedbackauth.substring(13)
    }


  next()
}

const isAuthenticated = (req, res, next) => {
    try {
        const auth = jwt.verify(req.token, process.env.SECRET)
        if (auth) {
            req.id = auth.id //user.id used in ratelimiting keys
        }
        next()
    } catch (error) {
        return res.status(401).json({ message: "not authenticated" })
    }
}

const feedBackAuthenticated = (req, res, next) => {
  try {
    const feedAuth = jwt.verify(req.feedbacktoken, process.env.PALAUTETOKENSECRET)
    if (feedAuth) {
      req.palauteID = feedAuth.palauteID  //palauteID used in ratelimiting keys
    }
    next()
  } catch (error) {
    return res.status(401).json({ message: "not authenticated" })

  }
}

const occasionLimiter = rateLimit({
  max: 20,
  windowMs: 30 * 60 * 1000, // 30 minutes
  message: 'Try again later',
  keyGenerator: function (req) {
    // use id as key if exists (should exist in all cases. Ip as backup)
    return req.id ? req.id : req.ip;
  }
});

const loginLimiter = rateLimit({
  max: 5,
  windowMs: 20 * 60 * 1000, // 20 minutes  
  message: 'Try again later!',
  keyGenerator: function (req) {
    return req.body.username.substring(0, MAXLENGTH) + req.ip;
  }
})

const feedBackLimiter = rateLimit({
  max: config.FEEDBACKLIMIT ? config.FEEDBACKLIMIT : 15,
  //windowMs: 30 * 60 * 1000, // 30 minutes
  //message: 'You seem to have given your feedback already!',
  keyGenerator: function (req) {
    return req.palauteID + req.ip
  }
})

const speedLimiter = slowDown({
  windowMs: 30 * 60 * 1000, // 30 minutes 
  delayAfter: config.SLOWDOWNAFTER ? config.SLOWDOWNAFTER : 75,
  delayMs: 500,
  keyGenerator: function (req) {
    // use id as key if exists (should exist in all cases. Ip as backup)
    return req.id ? req.id : req.ip;
  }
})
const announcementLimiter = rateLimit({
  max: 30,                  //30kpl 30min alkaa olemaan jo spämmiä
  windowMs: 30 * 60 * 1000, // 30 minutes  
  message: 'Try again later!',
  keyGenerator: function (req) {
    return req.id;
  }
})


module.exports = {
    errorHandler,
    tokenExtractor,
    isAuthenticated,
    speedLimiter,
    occasionLimiter,
    loginLimiter,
    feedBackLimiter,
    feedBackAuthenticated,
    announcementLimiter
}
