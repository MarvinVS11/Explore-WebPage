const router        = require('express').Router();
const AreaProtegida = require('../models/AreaProtegida');

const sf = (req) => ({ siteId: req.siteId });

router.get('/', async (req, res) => {
  try {
    const items = await AreaProtegida.find(sf(req)).sort({ order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const item = await AreaProtegida.create({ ...req.body, siteId: req.siteId });
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await AreaProtegida.findOneAndUpdate(
      { _id: req.params.id, ...sf(req) }, req.body, { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await AreaProtegida.findOneAndDelete({ _id: req.params.id, ...sf(req) });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
