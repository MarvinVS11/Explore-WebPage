// require('dotenv').config();
// const express   = require('express');
// const cors      = require('cors');
// const path      = require('path');
// const fs        = require('fs');
// const connectDB = require('./config/db');

// const app  = express();
// const PORT = process.env.PORT || 5000;

// // Conexión a MongoDB
// connectDB();

// // Crear carpeta uploads si no existe
// const uploadsDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Servir imágenes estáticas
// app.use('/uploads', express.static(uploadsDir));

// // Rutas
// app.use('/api',          require('./routes/index'));
// app.use('/api/config',   require('./routes/config'));
// app.use('/api/sections', require('./routes/sections'));
// app.use('/api/images',   require('./routes/images'));
// app.use('/api/navlinks', require('./routes/navlinks'));
// app.use('/api/reditems', require('./routes/reditems'));

// // Manejo de errores global
// app.use((err, req, res, next) => {
//   console.error('❌ Error:', err.message);
//   res.status(500).json({ error: err.message });
// });

// app.listen(PORT, () => {
//   console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
// });

require('dotenv').config(); // SIEMPRE primera línea antes de todo

const dns       = require('dns');
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const fs        = require('fs');
const connectDB = require('./config/db');

// Forzar servidores DNS para resolver registros SRV de MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Conexión a MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Crear carpeta uploads si no existe ──────────────────────────────────────
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Carpeta uploads creada');
}

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:5174', // Vite may auto-pick the next free port
    'http://localhost:3000', // por si usás otro puerto
  ],
  methods:     ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Archivos estáticos — imágenes subidas ────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ─── Rutas de la API ──────────────────────────────────────────────────────────
app.use('/api',          require('./routes/index'));
app.use('/api/config',   require('./routes/config'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/images',   require('./routes/images'));
app.use('/api/navlinks', require('./routes/navlinks'));
app.use('/api/reditems', require('./routes/reditems'));

// ─── Ruta de prueba para verificar que el servidor funciona ───────────────────
app.get('/health', (req, res) => {
  res.json({
    status:   'ok',
    message:  '🚀 Servidor Explore Occidente CR funcionando',
    database: 'explorewebpage',
    time:     new Date().toISOString(),
  });
});

// ─── Manejo de rutas no encontradas (404) ────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Manejo global de errores ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Error de Multer (archivo muy grande o formato no permitido)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'El archivo supera el límite de 5MB.' });
  }
  if (err.message === 'Formato no permitido. Solo JPG, PNG, WEBP o GIF.') {
    return res.status(400).json({ error: err.message });
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Error genérico
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// ─── Iniciar servidor ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📂 Archivos estáticos en http://localhost:${PORT}/uploads`);
  console.log(`❤️  Health check en http://localhost:${PORT}/health`);
});