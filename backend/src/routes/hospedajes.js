const router    = require('express').Router();
const Hospedaje = require('../models/Hospedaje');

router.get('/', async (req, res) => {
  try {
    const items = await Hospedaje.find({ siteId: req.siteId, isVisible: true }).sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
