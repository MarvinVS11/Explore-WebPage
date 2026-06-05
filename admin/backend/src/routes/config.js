const router     = require('express').Router();
const auth       = require('../middleware/auth');
const SiteConfig = require('../models/SiteConfig');

router.use(auth);

// GET /api/config/:key
router.get('/:key', async (req, res) => {
  try {
    const config = await SiteConfig.findOne({ key: req.params.key });
    if (!config) return res.status(404).json({ error: 'Config no encontrada' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/config/:key
router.put('/:key', async (req, res) => {
  try {
    const config = await SiteConfig.findOneAndUpdate(
      { key: req.params.key },
      { ...req.body, key: req.params.key },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
