const router  = require('express').Router();
const Section = require('../models/Section');

const siteFilter = (siteId, extra = {}) =>
  siteId === 'explore'
    ? { ...extra, $or: [{ siteId: 'explore' }, { siteId: { $exists: false } }] }
    : { ...extra, siteId };

// GET /api/sections
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find(siteFilter(req.siteId, { isVisible: true })).sort({ createdAt: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sections/:key
router.get('/:key', async (req, res) => {
  try {
    const section = await Section.findOne(siteFilter(req.siteId, { key: req.params.key }));
    if (!section) return res.status(404).json({ error: 'Sección no encontrada.' });
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
