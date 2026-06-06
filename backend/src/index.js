require('dotenv').config();

const dns       = require('dns');
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const fs        = require('fs');
const connectDB = require('./config/db');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Conexión a MongoDB ───────────────────────────────────────────────────────
const { seedIfEmpty } = require('./seeds/seed');

connectDB()
  .then(() => seedIfEmpty())
  .catch(err => console.error('❌ Error de base de datos:', err.message));

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods:     ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Archivos estáticos (solo en local — Vercel no tiene filesystem persistente) ─
if (!process.env.VERCEL) {
  const uploadsDir = path.join(__dirname, '../uploads');
  ['', '/images', '/video'].forEach(sub => {
    const dir = path.join(uploadsDir, sub);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
  app.use('/uploads', express.static(uploadsDir));
  app.use('/images',  express.static(path.join(uploadsDir, 'images')));
  app.use('/video',   express.static(path.join(uploadsDir, 'video')));
}

// ─── Rutas de la API ──────────────────────────────────────────────────────────
app.use('/api',          require('./routes/index'));
app.use('/api/config',   require('./routes/config'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/images',   require('./routes/images'));
app.use('/api/navlinks', require('./routes/navlinks'));
app.use('/api/reditems', require('./routes/reditems'));

app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'explore-public-api', time: new Date().toISOString() })
);

app.use((req, res) =>
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
);

app.use((err, req, res, next) => {
  console.error('❌', err.message);
  if (err.code === 'LIMIT_FILE_SIZE')
    return res.status(400).json({ error: 'El archivo supera el límite.' });
  if (err.message === 'Formato no permitido. Solo JPG, PNG, WEBP o GIF.')
    return res.status(400).json({ error: err.message });
  if (err.name === 'ValidationError')
    return res.status(400).json({ error: err.message });
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// ─── Solo escucha en local — en Vercel se exporta el app directamente ─────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`❤️  Health check en http://localhost:${PORT}/health`);
  });
}

module.exports = app;
