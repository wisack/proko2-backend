const mongoose = require('mongoose')
const defaultOccasionCardSetSchema = mongoose.Schema({
    vuosi: {type: Number, required: true},
    expected_role: { 
        type: String,
        enum: ["pro", "kummi"]
    },
    card_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OccasionCard"
    }]    
})

defaultOccasionCardSetSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('DefaultOccasionCardSet', defaultOccasionCardSetSchema)
