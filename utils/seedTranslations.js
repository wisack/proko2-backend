const mongoose = require('mongoose');
const Translation = require('../models/translation');
require('dotenv').config();

const en = require('./translation_en.js'); 
const fi = require('./translation_fi.js'); 

async function seed(dbUri) {
  try {
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    const translations = [
      { language: 'en', translations: en },
      { language: 'fi', translations: fi }
    ];

    for (const t of translations) {
      await Translation.findOneAndUpdate(
        { language: t.language },
        { $set: { translations: t.translations } },
        { upsert: true }
      );
      console.log(`Inserted/updated ${t.language}`);
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const arg = process.argv[2];
if (arg === 'test') {
  seed(process.env.TEST_MONGODB_URI);
} else if (arg === 'main') {
  seed(process.env.MONGODB_URI);
} else {
  console.log('Usage: node seed.js [test|main]');
}