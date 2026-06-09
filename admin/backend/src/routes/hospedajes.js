const router    = require('express').Router();
const Hospedaje = require('../models/Hospedaje');

const siteFilter = (req) => ({ siteId: req.siteId });

router.get('/', async (req, res) => {
  try {
    const items = await Hospedaje.find(siteFilter(req)).sort({ order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const item = await Hospedaje.create({ ...req.body, siteId: req.siteId });
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Hospedaje.findOneAndUpdate(
      { _id: req.params.id, ...siteFilter(req) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Hospedaje.findOneAndDelete({ _id: req.params.id, ...siteFilter(req) });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
