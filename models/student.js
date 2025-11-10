const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    name: String,
})

studentSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})
module.exports = mongoose.model('Student', studentSchema)
