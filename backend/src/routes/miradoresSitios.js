const router      = require('express').Router();
const MiradorSitio = require('../models/MiradorSitio');

router.get('/', async (req, res) => {
  try {
    const items = await MiradorSitio.find({ siteId: req.siteId, isVisible: true }).sort({ order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
