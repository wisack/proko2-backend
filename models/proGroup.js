const mongoose = require('mongoose')

const proGroupSchema = mongoose.Schema({
    science: String,
    vuosi: {type: Number, required: true},
    name: { type: String, required: true }, //instructors name
    user: { //instructor id
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    occasions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProGroupOccasion"
    }]
})

proGroupSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})


module.exports = mongoose.model('ProGroup', proGroupSchema)
