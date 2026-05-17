const router     = require('express').Router();
const SiteConfig = require('../models/SiteConfig');

// GET /api/config/:key — obtener config global
router.get('/:key', async (req, res) => {
  try {
    const config = await SiteConfig.findOne({ key: req.params.key });
    if (!config) return res.status(404).json({ error: 'Configuración no encontrada.' });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/config/:key — actualizar config global
router.put('/:key', async (req, res) => {
  try {
    const config = await SiteConfig.findOneAndUpdate(
      { key: req.params.key },
      { ...req.body, key: req.params.key },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;