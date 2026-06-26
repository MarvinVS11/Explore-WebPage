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
    const newOrder = Number(req.body.order) || 1;
    // Desplaza hacia arriba todos los links con orden >= al nuevo
    await NavLink.updateMany(
      { ...siteFilter(req.siteId), order: { $gte: newOrder } },
      { $inc: { order: 1 } }
    );
    const link = await NavLink.create({ ...req.body, order: newOrder, siteId: req.siteId });
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/navlinks/:id
router.put('/:id', async (req, res) => {
  try {
    const existing = await NavLink.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Link no encontrado' });

    const newOrder = Number(req.body.order);
    const oldOrder = existing.order;

    if (!isNaN(newOrder) && newOrder !== oldOrder) {
      if (newOrder > oldOrder) {
        // Mueve hacia arriba: baja los que están entre oldOrder+1 y newOrder
        await NavLink.updateMany(
          { ...siteFilter(req.siteId), order: { $gt: oldOrder, $lte: newOrder }, _id: { $ne: existing._id } },
          { $inc: { order: -1 } }
        );
      } else {
        // Mueve hacia abajo: sube los que están entre newOrder y oldOrder-1
        await NavLink.updateMany(
          { ...siteFilter(req.siteId), order: { $gte: newOrder, $lt: oldOrder }, _id: { $ne: existing._id } },
          { $inc: { order: 1 } }
        );
      }
    }

    const link = await NavLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
