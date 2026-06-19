const router          = require('express').Router();
const RestauranteSoda = require('../models/RestauranteSoda');

const sf = (req) => ({ siteId: req.siteId });

router.get('/', async (req, res) => {
  try {
    const items = await RestauranteSoda.find(sf(req)).sort({ order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const item = await RestauranteSoda.create({ ...req.body, siteId: req.siteId });
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await RestauranteSoda.findOneAndUpdate(
      { _id: req.params.id, ...sf(req) }, req.body, { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await RestauranteSoda.findOneAndDelete({ _id: req.params.id, ...sf(req) });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
