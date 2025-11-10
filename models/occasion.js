const mongoose = require('mongoose')

const aiheSchema = mongoose.Schema({
    aihe: { type: String, required: true },
    ohje: String,
    lapikayty: { type: Boolean, default: false }
})

const otsikkoSchema = mongoose.Schema({
    alaotsikko: String,
    aiheet: [aiheSchema],
    _id: false
})

const occasionSchema = mongoose.Schema({
    science: String,
    otsikko: { type: String },
    ohjauskerta: Number,
    date: Date,
    aiheet: [otsikkoSchema],
    paikalla: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    toiveet: {
        type: String,
        default: ""
    },
    ohjauspaikka: String,
    ohjaustapa: String,
    kesto: Number,
    sisallytysKesto: Number,
    lisäAiheet: Array,
    kotitehtava: {
        type: String,
        default: ""
    },
    suoritettu: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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

occasionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Occasion', occasionSchema)