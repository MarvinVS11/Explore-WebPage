const router  = require('express').Router();
const auth    = require('../middleware/auth');
const RedItem = require('../models/RedItem');

router.use(auth);

const siteFilter = (siteId, extra = {}) =>
  siteId === 'explore'
    ? { ...extra, $or: [{ siteId: 'explore' }, { siteId: { $exists: false } }] }
    : { ...extra, siteId };

// GET /api/reditems
router.get('/', async (req, res) => {
  try {
    const items = await RedItem.find(siteFilter(req.siteId)).sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reditems
router.post('/', async (req, res) => {
  try {
    const item = await RedItem.create({ ...req.body, siteId: req.siteId });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/reditems/:id
router.put('/:id', async (req, res) => {
  try {
    const item = await RedItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Ítem no encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reditems/:id
router.delete('/:id', async (req, res) => {
  try {
    await RedItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ítem eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
