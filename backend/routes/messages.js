const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Message = require('../models/Message');
const Key = require('../models/Key');

router.post('/', async (req, res) => {
  const { content, level } = req.body;
  try {
    const key = await Key.findOne({ level: parseInt(level) });
    if (!key) {
      return res.status(404).json({ message: 'Public key not found for the specified level.' });
    }

    const publicKey = key.publicKey;
    const encryptedContent = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(content, 'utf8')
    ).toString('base64');

    const newMessage = new Message({
      content: encryptedContent,
      level,
    });

    await newMessage.save();
    const responseMessage = {
      ...newMessage._doc,
      content: content,
    };

    res.status(201).json(responseMessage);
  } catch (err) {
    console.error('Error during message encryption:', err);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

router.get('/:level', async (req, res) => {
  const level = req.params.level;
  try {
    let messages = [];
    let decryptedMessages = [];

    if (parseInt(level) === 0) {
      messages = await Message.find();
      const keys = await Key.find();

      const keyMap = keys.reduce((map, key) => {
        map[key.level] = key.privateKey;
        return map;
      }, {});

      decryptedMessages = messages.map(message => {
        const privateKey = keyMap[message.level];
        if (!privateKey) {
          console.error(`Private key not found for level: ${message.level}`);
          return { ...message._doc, content: 'Decryption failed: Key not found' };
        }

        try {
          const decryptedContent = crypto.privateDecrypt(
            {
              key: privateKey,
              padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
              oaepHash: 'sha256',
            },
            Buffer.from(message.content, 'base64')
          ).toString('utf8');

          return { ...message._doc, content: decryptedContent };
        } catch (decryptionError) {
          console.error(`Decryption error for message ID ${message._id}:`, decryptionError);
          return { ...message._doc, content: 'Decryption failed' };
        }
      });

    } else {
      const key = await Key.findOne({ level: parseInt(level) });
      if (!key) {
        return res.status(404).json({ message: 'Key not found for the specified level.' });
      }

      const privateKey = key.privateKey;
      messages = await Message.find({ level: parseInt(level) });

      decryptedMessages = messages.map(message => {
        try {
          const decryptedContent = crypto.privateDecrypt(
            {
              key: privateKey,
              padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
              oaepHash: 'sha256',
            },
            Buffer.from(message.content, 'base64')
          ).toString('utf8');

          return { ...message._doc, content: decryptedContent };
        } catch (decryptionError) {
          console.error(`Decryption error for message ID ${message._id}:`, decryptionError);
          return { ...message._doc, content: 'Decryption failed' };
        }
      });
    }

    res.json(decryptedMessages);

  } catch (err) {
    console.error('Error during message decryption:', err);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const message = req.body;
    const level = message.level;
    const content = message.content;
    const key = await Key.findOne({ level: parseInt(level) });
    if (!key) {
      return res.status(404).json({ message: 'Public key not found for the specified level.' });
    }

    const publicKey = key.publicKey;
    const encryptedContent = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(content, 'utf8')
    ).toString('base64');
    const newMessage = {
      ...message,
      content: encryptedContent,
      level: level
    };
    await Message.findByIdAndUpdate(req.params.id, newMessage, { new: true });
    const responseMessage = {
      ...newMessage,
      content: content,
    };
    res.status(201).json(responseMessage);
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
