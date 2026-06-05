const router  = require('express').Router();
const auth    = require('../middleware/auth');
const Section = require('../models/Section');

router.use(auth);

// GET /api/sections
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find().sort({ createdAt: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sections/:key
router.get('/:key', async (req, res) => {
  try {
    const section = await Section.findOne({ key: req.params.key });
    if (!section) return res.status(404).json({ error: 'Sección no encontrada' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/sections/:key
router.put('/:key', async (req, res) => {
  try {
    const section = await Section.findOneAndUpdate(
      { key: req.params.key },
      { ...req.body, key: req.params.key },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
