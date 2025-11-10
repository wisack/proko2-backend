const mongoose = require('mongoose')

const proGroupOccasionSchema = mongoose.Schema({
    alkuperainenKortti: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OccasionCard",
    },
    muokattuKortti:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OccasionCard",
    },    
    //array of student who participated
    paikalla: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    //array of bools indicating if task in the card is completed
    suoritetutAiheet: [{ type: mongoose.Schema.Types.ObjectId }],
    lisaAiheet: Array,
    toiveet: String,
    kotitehtava: String,
    date: Date,
    kesto: Number,
    sisallytysKesto: Number,
    ohjauspaikka: String,
    ohjaustapa: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    suoritettu: { type: Boolean, default: false },
    muokattu: { type: Boolean, default: false },
    muokkaus: {
        type: String,
        default: ""
    },
    palaute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeedBack'
    }
})

proGroupOccasionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        returnedObject.suoritetutAiheet = returnedObject.suoritetutAiheet.map(it => it.toString())
        returnedObject.paikalla = returnedObject.paikalla.map(it => it.toString())
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('proGroupOccasion', proGroupOccasionSchema)
