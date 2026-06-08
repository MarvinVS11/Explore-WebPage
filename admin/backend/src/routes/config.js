const router     = require('express').Router();
const auth       = require('../middleware/auth');
const SiteConfig = require('../models/SiteConfig');

router.use(auth);

const siteFilter = (siteId, extra = {}) =>
  siteId === 'explore'
    ? { ...extra, $or: [{ siteId: 'explore' }, { siteId: { $exists: false } }] }
    : { ...extra, siteId };

// GET /api/config/:key
router.get('/:key', async (req, res) => {
  try {
    const config = await SiteConfig.findOne(siteFilter(req.siteId, { key: req.params.key }));
    if (!config) return res.status(404).json({ error: 'Config no encontrada' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/config/:key  (upsert)
router.put('/:key', async (req, res) => {
  try {
    const filter = { key: req.params.key, siteId: req.siteId };
    const config = await SiteConfig.findOneAndUpdate(
      filter,
      { ...req.body, key: req.params.key, siteId: req.siteId },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
