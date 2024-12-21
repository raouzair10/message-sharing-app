const express = require('express');
const router = express.Router();
const Key = require('../models/Key');

router.get('/:level', async (req, res) => {
  const { level } = req.params;
  try {
    const key = await Key.findOne({ level: parseInt(level) });
    if (!key) {
      return res.status(404).json({ message: 'Key not found for the specified level.' });
    }
    res.json({ publicKey: key.publicKey });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
