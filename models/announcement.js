const mongoose = require('mongoose')

const announcementSchema = mongoose.Schema({
    message: {
        type: String
    },
    date: Date,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverRole: {
        type: String,
        enum: ['superpro', 'all'],
        default: 'all'
    },
    sciences: [{
        type: String
    }]

})

announcementSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

    }
})

const Announcement = mongoose.model('Announcement', announcementSchema)

module.exports = Announcement
