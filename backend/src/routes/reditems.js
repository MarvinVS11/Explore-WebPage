const router  = require('express').Router();
const RedItem = require('../models/RedItem');

// GET /api/reditems — obtener todos los ítems activos
router.get('/', async (req, res) => {
  try {
    const items = await RedItem.find({ isActive: true }).sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reditems — reemplazar todos los ítems (admin)
router.put('/', async (req, res) => {
  try {
    await RedItem.deleteMany({});
    const items = await RedItem.insertMany(req.body);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reditems/:id — actualizar un ítem individual
router.put('/:id', async (req, res) => {
  try {
    const item = await RedItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Ítem no encontrado.' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;