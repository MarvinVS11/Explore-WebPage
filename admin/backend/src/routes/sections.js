const router  = require('express').Router();
const auth    = require('../middleware/auth');
const Section = require('../models/Section');

router.use(auth);

// Compatibilidad: documentos de explore sin siteId
const siteFilter = (siteId, extra = {}) =>
  siteId === 'explore'
    ? { ...extra, $or: [{ siteId: 'explore' }, { siteId: { $exists: false } }] }
    : { ...extra, siteId };

// GET /api/sections
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find(siteFilter(req.siteId)).sort({ createdAt: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sections/:key
router.get('/:key', async (req, res) => {
  try {
    const section = await Section.findOne(siteFilter(req.siteId, { key: req.params.key }));
    if (!section) return res.status(404).json({ error: 'Sección no encontrada' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/sections/:key  (upsert)
router.put('/:key', async (req, res) => {
  try {
    const filter = { key: req.params.key, siteId: req.siteId };
    const section = await Section.findOneAndUpdate(
      filter,
      { ...req.body, key: req.params.key, siteId: req.siteId },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
