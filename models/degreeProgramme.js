const mongoose = require('mongoose')

const degreeSchema = mongoose.Schema({
    science: { type: String, unique: true, required: true },
    intScience  : { type: Boolean, required: true },
})

degreeSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})


module.exports = mongoose.model('DegreeProgramme', degreeSchema)