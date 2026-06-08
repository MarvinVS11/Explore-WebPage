const router  = require('express').Router();
const NavLink = require('../models/NavLink');

const siteFilter = (siteId, extra = {}) =>
  siteId === 'explore'
    ? { ...extra, $or: [{ siteId: 'explore' }, { siteId: { $exists: false } }] }
    : { ...extra, siteId };

// GET /api/navlinks
router.get('/', async (req, res) => {
  try {
    const links = await NavLink.find(siteFilter(req.siteId, { isActive: true })).sort({ order: 1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
