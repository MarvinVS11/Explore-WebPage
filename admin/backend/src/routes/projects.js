const router     = require('express').Router();
const auth       = require('../middleware/auth');
const Project    = require('../models/Project');
const upload     = require('../config/multer');
const cloudinary = require('../config/cloudinary');

router.use(auth);

function uploadToCloudinary(buffer, mimetype) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'explore-occidente/proyectos', resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ siteId: req.siteId }).sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const count = await Project.countDocuments({ siteId: req.siteId });
    const project = await Project.create({
      ...req.body,
      siteId: req.siteId,
      order:  req.body.order ?? count + 1,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/projects/:id/image/:side  (side = left | right)
router.post('/:id/image/:side', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
  const { side } = req.params;
  if (!['left', 'right'].includes(side))
    return res.status(400).json({ error: 'Side debe ser left o right' });
  try {
    const result  = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    const field   = side === 'left' ? 'imgLeftUrl' : 'imgRightUrl';
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { [field]: result.secure_url },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Proyecto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
