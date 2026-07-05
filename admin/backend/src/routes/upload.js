const router     = require('express').Router();
const auth       = require('../middleware/auth');
const upload     = require('../config/multer');
const cloudinary = require('../config/cloudinary');

router.use(auth);

function sanitizePublicId(filename) {
  // Quitar extensión, reemplazar caracteres no permitidos por guión bajo
  return filename
    .replace(/\.[^/.]+$/, '')                 // quitar extensión
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quitar tildes
    .replace(/[^a-zA-Z0-9._-]/g, '_')        // sólo alfanumérico + ._-
    .replace(/_+/g, '_')                      // colapsar múltiples _
    .replace(/^_|_$/g, '');                   // quitar _ al inicio/fin
}

function uploadToCloudinary(buffer, mimetype, folder, originalName, options = {}) {
  return new Promise((resolve, reject) => {
    let resourceType = 'image';
    if (mimetype.startsWith('video/')) resourceType = 'video';
    else if (!mimetype.startsWith('image/')) resourceType = 'raw';

    const uploadOptions = {
      folder:        `explore-occidente/${folder}`,
      resource_type: resourceType,
      ...options,
    };

    if (originalName) {
      uploadOptions.public_id      = sanitizePublicId(originalName);
      uploadOptions.unique_filename = false;
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

// POST /upload/image
router.post('/image', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
  try {
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      'images',
      req.file.originalname
    );
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error('[upload/image]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /upload/video
router.post('/video', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
  try {
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      'video',
      req.file.originalname
    );
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error('[upload/video]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /upload/documento — almacena en MongoDB GridFS
router.post('/documento', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
  try {
    const { getGridFSBucket } = require('../config/gridfs');
    const bucket = getGridFSBucket();

    const fileId = await new Promise((resolve, reject) => {
      const stream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: {
          siteId:       req.siteId,
          originalName: req.file.originalname,
          uploadedBy:   req.user?.id || 'admin',
        },
      });
      stream.on('error', reject);
      stream.on('finish', () => resolve(stream.id));
      stream.end(req.file.buffer);
    });

    res.json({
      url:      `/api/files/${fileId}`,
      fileId:   fileId.toString(),
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    });
  } catch (err) {
    console.error('[upload/documento]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /upload/:publicId(*) — elimina de Cloudinary
router.delete('/:publicId(*)', async (req, res) => {
  const publicId = req.params.publicId;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    res.json({ message: 'Archivo eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
