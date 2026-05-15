const express = require('express');
const router = express.Router();

// TODO: Import NavLink model and add navigation link routes

router.get('/', (req, res) => {
  res.status(200).json({ message: 'NavLinks route works' });
});

module.exports = router;
