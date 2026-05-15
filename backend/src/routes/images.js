const express = require('express');
const router = express.Router();

// TODO: Import Image model and add image routes

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Images route works' });
});

module.exports = router;
