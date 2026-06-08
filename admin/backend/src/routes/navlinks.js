const router  = require('express').Router();
const auth    = require('../middleware/auth');
const NavLink = require('../models/NavLink');

router.use(auth);

const siteFilter = (siteId, extra = {}) =>
  siteId === 'explore'
    ? { ...extra, $or: [{ siteId: 'explore' }, { siteId: { $exists: false } }] }
    : { ...extra, siteId };

// GET /api/navlinks
router.get('/', async (req, res) => {
  try {
    const links = await NavLink.find(siteFilter(req.siteId)).sort({ order: 1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/navlinks
router.post('/', async (req, res) => {
  try {
    const link = await NavLink.create({ ...req.body, siteId: req.siteId });
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/navlinks/:id
router.put('/:id', async (req, res) => {
  try {
    const link = await NavLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!link) return res.status(404).json({ error: 'Link no encontrado' });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/navlinks/:id
router.delete('/:id', async (req, res) => {
  try {
    await NavLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Link eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
