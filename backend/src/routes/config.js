const express = require('express');
const router = express.Router();

// TODO: Import SiteConfig model and add configuration routes

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Config route works' });
});

module.exports = router;
