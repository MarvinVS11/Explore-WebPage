const express = require('express');
const router = express.Router();

// TODO: Import Section model and add section routes

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Sections route works' });
});

module.exports = router;
