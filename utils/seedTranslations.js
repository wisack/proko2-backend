const mongoose = require('mongoose');
const Translation = require('../models/translation');
const logger = require('./logger');
require('dotenv').config();

const en = require('./translation_en.js'); 
const fi = require('./translation_fi.js'); 

const seedTranslationsIfNeeded = async () => {
  try {
    const translations = [
      { language: 'en', translations: en },
      { language: 'fi', translations: fi }
    ];

    for (const t of translations) {
      const existing = await Translation.findOne({ language: t.language });
      if (!existing) {
        await new Translation({
          language: t.language,
          translations: t.translations
        }).save();
        logger.info(`Auto-seeded default translations for language: ${t.language}`);
      }
    }
  } catch (err) {
    logger.error('Error auto-seeding translations:', err.message);
  }
};

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

if (require.main === module) {
  const arg = process.argv[2];
  if (arg === 'test') {
    seed(process.env.TEST_MONGODB_URI);
  } else if (arg === 'main') {
    seed(process.env.MONGODB_URI);
  } else {
    console.log('Käyttö: $ node seedTranslations.js [test|main]');
  }
}

module.exports = {
  seedTranslationsIfNeeded,
  seed
};