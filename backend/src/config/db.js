// Database configuration module

// module.exports = {
//   host: 'localhost',
//   port: 5432,
//   database: 'explore_webpage',
//   user: 'user',
//   password: 'password',
// };

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Opciones recomendadas para evitar warnings
      serverSelectionTimeoutMS: 5000, // timeout si no encuentra el servidor
      socketTimeoutMS: 45000,         // timeout de operaciones
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    console.log(` Base de datos: ${conn.connection.name}`);

  } catch (error) {
    console.error(` Error de conexión: ${error.message}`);
    process.exit(1); // detiene el servidor si no hay conexión
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