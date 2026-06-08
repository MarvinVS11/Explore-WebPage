const dns      = require('dns');
const mongoose = require('mongoose');

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Elimina índices simples de key que causan duplicados al usar multi-site
async function dropLegacyIndexes(conn) {
  const collections = { sections: 'key_1', siteconfigs: 'key_1' };
  for (const [col, idx] of Object.entries(collections)) {
    try {
      await conn.collection(col).dropIndex(idx);
      console.log(`🔧 Índice legacy '${idx}' eliminado de '${col}'`);
    } catch (_) {
      // Índice no existe o ya fue eliminado — ok
    }
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host} / ${conn.connection.name}`);
    await dropLegacyIndexes(conn.connection);
  } catch (err) {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
