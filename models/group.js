const mongoose = require('mongoose')

const groupSchema = mongoose.Schema({
    science: String,
    name: { type: String, required: true },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    occasions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Occasion'
    }],
    kertymä: Number, //use laskeKertyma function instead of this
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

groupSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})


module.exports = mongoose.model('Group', groupSchema)
