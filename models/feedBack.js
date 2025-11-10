const mongoose = require('mongoose')

const feedBackSchema = mongoose.Schema({
    needsimproving: {
        type: Number,
        default: 0
    },
    ok: {
        type: Number,
        default: 0
    },
    good: {
        type: Number,
        default: 0
    },
    feedbacktexts: [{
        type: String
    }]
})

feedBackSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

    }
})

const FeedBack = mongoose.model('FeedBack', feedBackSchema)

module.exports = FeedBack