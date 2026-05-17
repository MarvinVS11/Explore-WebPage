const router  = require('express').Router();
const NavLink = require('../models/NavLink');

// GET /api/navlinks — obtener todos los links activos
router.get('/', async (req, res) => {
  try {
    const links = await NavLink.find({ isActive: true }).sort({ order: 1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/navlinks — reemplazar todos los links (admin)
router.put('/', async (req, res) => {
  try {
    // req.body debe ser un array de links
    await NavLink.deleteMany({});
    const links = await NavLink.insertMany(req.body);
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/navlinks/:id — actualizar un link individual
router.put('/:id', async (req, res) => {
  try {
    const link = await NavLink.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!link) return res.status(404).json({ error: 'Link no encontrado.' });
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;