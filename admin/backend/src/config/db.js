const dns      = require('dns');
const mongoose = require('mongoose');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (err) {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
