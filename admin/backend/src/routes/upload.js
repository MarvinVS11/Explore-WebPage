const router = require('express').Router();
const path   = require('path');
const fs     = require('fs');
const auth   = require('../middleware/auth');
const upload = require('../config/multer');

const BASE_URL = process.env.ADMIN_BACKEND_URL || 'http://localhost:5001';

router.use(auth);

// POST /upload/image — sube una imagen
router.post('/image', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
  const url = `${BASE_URL}/media/images/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

// POST /upload/video — sube un video
router.post('/video', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
  const url = `${BASE_URL}/media/video/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

// DELETE /upload/:type/:filename — elimina un archivo
router.delete('/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  if (!['images', 'video'].includes(type)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  const filePath = path.join(__dirname, '../../uploads', type, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'Archivo eliminado' });
  } else {
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
});

module.exports = router;
