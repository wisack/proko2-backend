const mongoose = require('mongoose')
const occasionCard_ArchiveSchema = mongoose.Schema({
    vuosi: {type:Number, required: true}, //kortin vuosi
    archived_date: Date,
    expected_role: String,
    
    alkuperainenKortti: {type: mongoose.Schema.Types.ObjectId, ref: "OccasionCard" },
    //----------------------------------------    
    perScience: [{ //tutkinto-ohjelmittainen tilasto
        science: String,
        palautukset_lkm: Number,
        muokkaukset_lkm: Number,

        paikalla_lkm: Number,
        paikalla_min: Number,
        paikalla_max: Number,
        
        kesto_yht: Number,
        kesto_min: Number,
        kesto_max: Number,
        
        
        muokatutKortit:     [{type: mongoose.Schema.Types.ObjectId, ref: "OccasionCard" }],
        
        palaute: { 
            needsimproving: { type: Number, default: 0},
            ok:             { type: Number, default: 0},
            good:           { type: Number, default: 0},
            feedbacktexts_perOccasion: [{
                occasion_id: {type: mongoose.Schema.Types.ObjectId, ref: "ProGroupOccasion"},
                feedbacktexts: [{type: String}]
            }]
        },
        aiheet : [{ //Copy from original card
            original_id: { type: mongoose.Schema.Types.ObjectId },     
            muokattu_lkm: Number,
            poistettu_lkm: Number,

            aiheet: [{
                original_id: { type: mongoose.Schema.Types.ObjectId },     
                muokattu_lkm: Number,
                poistettu_lkm: Number,
                suoritettu_lkm: Number,
            }],

        }],
        lisaAiheet: [{lisaAiheet: [{type: String}],
                      card_id: {type: mongoose.Schema.Types.ObjectId, ref: "OccasionCard" },
                      occasion_id: {type: mongoose.Schema.Types.ObjectId, ref: "ProGroupOccasion"}}],
                 
                     
        muokkaukset: [{muokkaus: String,
                       card_id: {type: mongoose.Schema.Types.ObjectId, ref: "OccasionCard" },
                       occasion_id: {type: mongoose.Schema.Types.ObjectId, ref: "ProGroupOccasion"}}],
                       
                       
        
    }]
})

occasionCard_ArchiveSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model("OccasionCard_Archive", occasionCard_ArchiveSchema)
