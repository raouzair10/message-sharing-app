const mongoose = require('mongoose');
const crypto = require('crypto');
const Key = require('../models/Key');
const dotenv = require('dotenv');

dotenv.config();

async function generateAndStoreKeysForLevels() {
  const levels = [1, 2, 3];
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const level of levels) {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
      });

      const newKey = new Key({
        level,
        publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }),
        privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }),
      });

      await newKey.save();
      console.log(`Keys for level ${level} saved successfully.`);
    }
  } catch (err) {
    console.error('Error generating and storing keys:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

generateAndStoreKeysForLevels();
