const express = require('express');
const router = express.Router();

// TODO: Import RedItem model and add red item routes

router.get('/', (req, res) => {
  res.status(200).json({ message: 'RedItems route works' });
});

module.exports = router;
