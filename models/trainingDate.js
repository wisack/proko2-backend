const mongoose = require('mongoose')

const trainingdateSchema = mongoose.Schema({
    name: String,
})

trainingdateSchema.set('toJSON', {
  name: { type: String, required: true, unique: true },
  pvm: { type: Date, required: false, unique: false },
  duration: { type: Number, required: false, unique: false }, //duration in hours
})

module.exports = mongoose.model('TrainingDate', trainingdateSchema)