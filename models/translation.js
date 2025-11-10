const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  language: { type: String, required: true, unique: true },
  translations: { type: Object, required: true }
});

const Translation = mongoose.model('Translation', translationSchema);

module.exports = Translation;

