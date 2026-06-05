const router = require('express').Router();
const auth   = require('../middleware/auth');
const Image  = require('../models/Image');

router.use(auth);

// GET /api/images?section=nosotros
router.get('/', async (req, res) => {
  try {
    const filter = req.query.section ? { section: req.query.section } : {};
    const images = await Image.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/images
router.post('/', async (req, res) => {
  try {
    const image = await Image.create(req.body);
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
    res.json({ message: 'Imagen eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
