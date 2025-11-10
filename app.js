const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
require('express-async-errors')
const path = require('path')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const groupController = require('./controllers/group')
const occasionController = require('./controllers/occasion')
const superRouter = require('./controllers/superpro')
const adminController = require('./controllers/admin')
const feedBackRouter = require('./controllers/feedback')
const messageRouter = require('./controllers/messages')
const translationRouter = require('./controllers/translation')
const degreeRouter = require('./controllers/degree')
const koulutusRouter = require('./controllers/koulutus')

const useLimiters = config.RATELIMITERS   //set off for quick deactivation of rate limiting
const app = express()

useLimiters && app.set('trust proxy', 1); //for rate limiter 

mongoose.set('useCreateIndex', true)

mongoose.connect(config.MONGODB_URI, config.MONGOCONFIG)
  .then(() => {
    logger.info('connected to MONGODB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


mongoose.set('useFindAndModify', false)
app.use(express.json())
app.use(cors())
app.use(middleware.tokenExtractor)
app.use(express.static('build'))
app.use('/api/feedBack', middleware.feedBackAuthenticated)
useLimiters && app.use('/api/feedBack', middleware.feedBackLimiter)
app.use('/api/feedBack', feedBackRouter)
app.use('/api/translations', translationRouter)

useLimiters && app.use('/api/login', middleware.loginLimiter)
app.use('/api/login', loginRouter)
app.use(middleware.isAuthenticated)
useLimiters && app.use(middleware.speedLimiter)
useLimiters && app.post('/api/messages/announcement', middleware.announcementLimiter)
app.use('/api/messages', messageRouter)
app.use('/api/users', usersRouter)
app.use('/api/group', groupController.router)
useLimiters && app.post('/api/occasion', middleware.occasionLimiter)
app.use('/api/occasion', occasionController.router)
app.use('/api/ryhmat', superRouter)
app.use('/api/admin', adminController.router);
app.use('/api/degrees', degreeRouter)
app.use('/api/koulutus', koulutusRouter)

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.use(middleware.errorHandler)

module.exports = app
