const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ message: '🚀 API Explore Occidente CR funcionando' });
});

module.exports = router;