const router  = require('express').Router();
const Section = require('../models/Section');

// GET /api/sections — obtener todas las secciones
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find({ isVisible: true }).sort({ createdAt: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sections/:key — obtener sección por key
router.get('/:key', async (req, res) => {
  try {
    const section = await Section.findOne({ key: req.params.key });
    if (!section) return res.status(404).json({ error: 'Sección no encontrada.' });
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/sections/:key — actualizar o crear sección
router.put('/:key', async (req, res) => {
  try {
    const section = await Section.findOneAndUpdate(
      { key: req.params.key },
      { ...req.body, key: req.params.key },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;