const mongoose = require('mongoose')
const proGroup_ArchiveSchema = mongoose.Schema({
    vuosi: {type:Number, required: true},
    archiveName: String, //When personal information is removed, this will be used instead of the groups instructors name
    group: {type:mongoose.Schema.Types.ObjectId, ref: "ProGroup"},
    archived_date: Date,
    science: String,
    
    role: {
        type: String,
        enum: ['pro', 'superpro', 'fmpro', 'admin', 'kummi']
    },
    special: {
        type: String,
        default: ""
    },
    intScience: {
        type: String,
        default: ""
    },
    oppilaat_lkm: Number,
    ohjauskerrat_lkm: Number,
    
    kesto_yht: Number,
    kesto_min: Number,
    kesto_max: Number,
    
    paikalla_lkm: Number,
    paikalla_min: Number,
    paikalla_max: Number,
    
    alkuperaisetKortit: [{type: mongoose.Schema.Types.ObjectId, ref: "OccasionCard" }],
    muokatutKortit: [{type: mongoose.Schema.Types.ObjectId, ref: "OccasionCard" }],
    omatKortit:  [{type: mongoose.Schema.Types.ObjectId, ref: "OccasionCard" }],
    occasions: [{
        date: Date,
        cardName: String,
        isCardCustom: Boolean,
        isCardModified: Boolean,
        occasion_id: {type: mongoose.Schema.Types.ObjectId, ref: "ProGroupOccasion"},
    }],
    palaute: { 
        needsimproving: { type: Number, default: 0},
        ok:             { type: Number, default: 0},
        good:           { type: Number, default: 0},
        feedbacktexts_perOccasion: [{
            occasion_id: {type: mongoose.Schema.Types.ObjectId, ref: "ProGroupOccasion"},
            feedbacktexts: [{type: String}]
        }]
    },
})

proGroup_ArchiveSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model("ProGroup_Archive", proGroup_ArchiveSchema)
