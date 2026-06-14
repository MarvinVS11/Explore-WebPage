const router    = require('express').Router();
const Documento = require('../models/Documento');

const siteFilter = (req) => ({ siteId: req.siteId });

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = siteFilter(req);
    if (category) filter.category = category;
    const items = await Documento.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const item = await Documento.create({ ...req.body, siteId: req.siteId });
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Documento.findOneAndUpdate(
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
    await Documento.findOneAndDelete({ _id: req.params.id, ...siteFilter(req) });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
