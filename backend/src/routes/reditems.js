const router  = require('express').Router();
const RedItem = require('../models/RedItem');

const siteFilter = (siteId, extra = {}) =>
  siteId === 'explore'
    ? { ...extra, $or: [{ siteId: 'explore' }, { siteId: { $exists: false } }] }
    : { ...extra, siteId };

// GET /api/reditems
router.get('/', async (req, res) => {
  try {
    const items = await RedItem.find(siteFilter(req.siteId, { isActive: true })).sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
