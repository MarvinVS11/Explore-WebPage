const router     = require('express').Router();
const SiteConfig = require('../models/SiteConfig');

const siteFilter = (siteId, extra = {}) =>
  siteId === 'explore'
    ? { ...extra, $or: [{ siteId: 'explore' }, { siteId: { $exists: false } }] }
    : { ...extra, siteId };

// GET /api/config/:key
router.get('/:key', async (req, res) => {
  try {
    const config = await SiteConfig.findOne(siteFilter(req.siteId, { key: req.params.key }));
    if (!config) return res.status(404).json({ error: 'Configuración no encontrada.' });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
