const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const connectDB = require('./src/config/db');
const Section = require('./src/models/Section');

(async () => {
  try {
    await connectDB();
    const doc = await Section.findOne({ key: 'nosotros' }).lean();
    console.log(JSON.stringify(doc, null, 2));
  } catch (err) {
    console.error('ERROR', err.message);
  } finally {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
  }
})();
