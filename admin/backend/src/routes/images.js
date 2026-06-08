const router     = require('express').Router();
const auth       = require('../middleware/auth');
const Image      = require('../models/Image');
const cloudinary = require('../config/cloudinary');

router.use(auth);

const siteFilter = (siteId, extra = {}) =>
  siteId === 'explore'
    ? { ...extra, $or: [{ siteId: 'explore' }, { siteId: { $exists: false } }] }
    : { ...extra, siteId };

// GET /api/images?section=nosotros
router.get('/', async (req, res) => {
  try {
    const extra = req.query.section ? { section: req.query.section } : {};
    const images = await Image.find(siteFilter(req.siteId, extra)).sort({ order: 1, createdAt: 1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/images
router.post('/', async (req, res) => {
  try {
    const image = await Image.create({ ...req.body, siteId: req.siteId });
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/images/:id
router.put('/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/images/:id
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId).catch(() => {});
    }
    res.json({ message: 'Imagen eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
