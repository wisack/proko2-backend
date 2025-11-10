const router = require('express').Router()
const Translation = require('../models/translation')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
// Get all translations - fi, en. Toggled in frontend
// GET /api/translations/
router.get("/", async (req, res) => {
    logger.info("Fetching all translations");
    try {
            const translations = await Translation.find({});
            if (!translations) return res.status(404).send("Not found");
            return res.status(200).json(translations);
        }
 catch (error) {
        console.error("Error fetching translations:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.patch('/:language', async (req, res) => {
  const { language } = req.params;
  const updates = req.body; // { key1: "value1", key2: "value2" }

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const admin = await User.findById(decodedToken.id)
     if (admin.role !== "admin") {
          return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
      }
    const updateFields = {};
    for (const [key, value] of Object.entries(updates)) {
      updateFields[`translations.${key}`] = value;
    }

    const updatedDoc = await Translation.findOneAndUpdate(
      { language },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Language not found' });
    }

    res.json({ success: true, updated: updateFields });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router
