const router = require('express').Router();
const path   = require('path');
const fs     = require('fs');
const upload = require('../config/multer');
const Image  = require('../models/Image');

// POST /api/images — subir imagen y guardar en MongoDB
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    }

    const { section, role, alt, linkUrl, order } = req.body;
    const url = `/uploads/${req.file.filename}`;

    const image = await Image.create({
      url,
      section,
      role:    role    || 'galeria',
      alt:     alt     || '',
      linkUrl: linkUrl || '',
      order:   order   || 0,
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/images — listar imágenes (filtro opcional por section y role)
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.section) filter.section = req.query.section;
    if (req.query.role)    filter.role    = req.query.role;

    const images = await Image.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/images/:id — obtener una imagen por ID
router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Imagen no encontrada.' });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/images/:id — actualizar datos de una imagen
router.put('/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!image) return res.status(404).json({ error: 'Imagen no encontrada.' });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/images/:id — eliminar imagen de DB y del disco
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Imagen no encontrada.' });

    // Eliminar archivo físico del disco
    const filePath = path.join(__dirname, '../../uploads', path.basename(image.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Imagen eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;