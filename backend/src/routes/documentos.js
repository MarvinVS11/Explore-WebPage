const router    = require('express').Router();
const Documento = require('../models/Documento');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { siteId: req.siteId, isVisible: true };
    if (category) filter.category = category;
    const items = await Documento.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
