const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async (req, res) => {
  const content = req.body.content;
  const level = req.body.level;
  try {
    const newMessage = new Message({
      content,
      level,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const { level } = req.query;
  try {
    const query = level && parseInt(level) !== 0 ? { level: parseInt(level) } : {};
    const messages = await Message.find(query);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log(req.body)
    const message = await Message.findByIdAndUpdate(req.params.id, req.body.message, { new: true });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
