const router  = require('express').Router();
const Project = require('../models/Project');

// GET /api/projects  (público — solo proyectos visibles del sitio activo)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ siteId: req.siteId, isVisible: true }).sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
