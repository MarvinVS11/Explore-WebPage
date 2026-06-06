// Database configuration module

// module.exports = {
//   host: 'localhost',
//   port: 5432,
//   database: 'explore_webpage',
//   user: 'user',
//   password: 'password',
// };

const dns = require('dns');
const mongoose = require('mongoose');

// Usar DNS públicos para que MongoDB Atlas resuelva los registros SRV correctamente
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(' MONGO_URI no está definida. Verificá backend/.env');
    process.exit(1);
  }

  const mainOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(uri, mainOptions);
    console.log(`MongoDB conectado: ${conn.connection.name}`);
    return;
  } catch (error) {
    console.error(`Error de conexión: ${error.message}`);
    throw error;
  }
};

// Eventos de conexión para monitoreo en desarrollo
mongoose.connection.on('disconnected', () => {
  console.warn(' MongoDB desconectado');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconectado');
});

module.exports = connectDB;