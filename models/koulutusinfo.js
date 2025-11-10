const mongoose = require('mongoose')

const koulutusObjSchema = new mongoose.Schema({
  tapahtuma: { type: String, required: true },
  laskutus: { type: Number, required: true },
}, { _id: true });

const koulutusinfoSchema = new mongoose.Schema({
  selectedLanguage: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: Object, //Quill Delta JSON
    default: {},
  },
  koulutukset: [koulutusObjSchema],
  koulutusRaja: { type: Number, required: false }, 
  suunnitelmaRaja: { type: Number, required: false },
  tuutorointiRaja: { type: Number, required: false },
  role: { type: String, required: false },
  suunnitelmatToggle: { type: Boolean, required: false }
});


koulutusinfoSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Koulutusinfo', koulutusinfoSchema);