const router = require('express').Router()
const DegreeProgramme = require('../models/degreeProgramme')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
// Get all degree programmes
// GET /api/degrees/
router.get("/", async (req, res) => {
    if (!req.token) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
            const degrees = await DegreeProgramme.find({});
            if (!degrees) return res.status(404).send("Not found");
            return res.status(200).json(degrees);
        }
    catch (error) {
        console.error("Error fetching degrees:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.post("/", async (req, res) => {
  const { sciences } = req.body;

    if (!req.token) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

  if (!Array.isArray(sciences) || sciences.length === 0) {
    return res.status(400).json({ error: "Sciences array is required" });
  }

  try {
      const decodedToken = jwt.verify(req.token, process.env.SECRET)
      const admin = await User.findById(decodedToken.id)
      if (admin.role !== "admin") {
          return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
      }

    const results = [];

    for (const item of sciences) {
      if (!item.science) continue;

      try {
        const degree = await DegreeProgramme.findOneAndUpdate(
          { science: item.science },
          { $setOnInsert: { intScience: item.intScience || false } },  // set if new
          { upsert: true, new: true }
        );

        results.push(degree);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`Duplicate skipped: ${item.science}`);
        } else {
          throw err;
        }
      }
    }

    return res.status(201).json(results);
  } catch (error) {
    console.log("Error saving sciences:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// DELETE /api/degrees/:id
router.delete("/:id", async (req, res) => {

    if (!req.token) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const admin = await User.findById(decodedToken.id)
    if (admin.role !== "admin") {
        return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
    }

    const result = await DegreeProgramme.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting degree:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  if (!req.token) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const admin = await User.findById(decodedToken.id)
    if (admin.role !== "admin") {
          return res.status(401).json({ error: 'Et ole tietokannan hallitsija.' })
    }

    const degree = await DegreeProgramme.findById(req.params.id);

    if (!degree) {
      return res.status(404).send("Not found");
    }

    return res.status(200).json(degree);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router
