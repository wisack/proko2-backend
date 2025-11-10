const KoulutusInfo = require('../models/koulutusinfo.js');
const TrainingDate = require('../models/trainingDate.js');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const router = require('express').Router()


router.post('/fulltext', async (req, res) => {
  if (!req.token) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const admin = await User.findById(decodedToken.id);

    if (admin.role !== "admin") {
      return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' });
    }

    const { content, selectedLanguage } = req.body;
    const doc = await KoulutusInfo.findOneAndUpdate(
      { selectedLanguage },
      { $set: { content } },
      { new: true, upsert: true }
    );

    res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Saving failed' });
  }
});


router.get('/fulltext', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: "token missing or invalid" });
    }
    const { selectedLanguage } = req.query;

    const doc = await KoulutusInfo.findOne({ selectedLanguage });
    res.json(doc?.content || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loading failed' });
  }
});

router.post('/', async (req, res) => {
    if (!req.token) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const admin = await User.findById(decodedToken.id);
    if (admin.role !== "admin") {
      return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' });
    }
    console.log(req.body);
    const { koulutukset, selectedLanguage } = req.body;
    const doc = await KoulutusInfo.findOneAndUpdate(
      { selectedLanguage: selectedLanguage },
      { $set: { koulutukset } }, 
      { new: true, upsert: true }
    );
    res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Saving failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    if (!req.token) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  const { selectedLanguage } = req.query;
  const doc = await KoulutusInfo.findOne({ selectedLanguage: selectedLanguage });
  res.json(doc?.koulutukset || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loading failed' });
  }
});

router.get('/tuntirajat', async (req, res) => {
  try {
    if (!req.token) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const { selectedLanguage } = req.query;
  const doc = await KoulutusInfo.findOne({ selectedLanguage });
  res.json({
    koulutusRaja: doc?.koulutusRaja || null,
    suunnitelmaRaja: doc?.suunnitelmaRaja || null,
    tuutorointiRaja: doc?.tuutorointiRaja || null
  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loading failed' });
  }
});

router.post('/tuntirajat', async (req, res) => {
  if (!req.token) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const admin = await User.findById(decodedToken.id);
    if (admin.role !== "admin") {
      return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' });
    }

    const { limits, selectedLanguage } = req.body;
    const { koulutusRaja, suunnitelmaRaja, tuutorointiRaja } = limits;
    const doc = await KoulutusInfo.findOneAndUpdate(
      { selectedLanguage },
      { $set: { koulutusRaja, suunnitelmaRaja, tuutorointiRaja } },
      { new: true, upsert: true }
    );
    res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Saving failed' });
  }
});

router.post('/suunnitelmatToggle', async (req, res) => {
  if (!req.token) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const admin = await User.findById(decodedToken.id);
    if (admin.role !== "admin") {
      return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' });
    } 
    const { suunnitelmatToggle, role } = req.body;
    let selectedLanguage
    if (role === 'kummi')
      selectedLanguage = 'en'
    else if (role === 'pro')
      selectedLanguage = 'fi'
    console.log(suunnitelmatToggle, role);
    const doc = await KoulutusInfo.findOneAndUpdate(
      { selectedLanguage },
      { $set: { suunnitelmatToggle, role } },
      { new: true, upsert: true }
    );
    res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Saving failed' });
  }
});

router.get('/suunnitelmatToggle', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: "token missing or invalid" });
    }
    const { role } = req.query;
    const doc = await KoulutusInfo.findOne({ role });
    res.json({
      suunnitelmatToggle: doc?.suunnitelmatToggle || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loading failed' });
  }
});

module.exports = router