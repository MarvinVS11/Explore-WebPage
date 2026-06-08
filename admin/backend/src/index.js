require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const fs        = require('fs');
const connectDB = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 5001;

connectDB();

// Carpetas de uploads solo en local (Vercel no tiene filesystem persistente)
if (!process.env.VERCEL) {
  const uploadsDir = path.join(__dirname, '../uploads');
  ['images', 'video'].forEach(folder => {
    const dir = path.join(uploadsDir, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      process.env.ADMIN_FRONTEND_URL,
    ].filter(Boolean);
    // Permitir todas las URLs de Vercel (previews de release, staging, etc.)
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Origen no permitido'));
    }
  },
  methods:     ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// Extrae el sitio activo del header enviado por el frontend admin
app.use((req, res, next) => {
  req.siteId = req.headers['x-site-id'] || 'explore';
  next();
});

// Servir archivos subidos solo en local (en producción se usan URLs de Cloudinary)
if (!process.env.VERCEL) {
  const uploadsDir = path.join(__dirname, '../uploads');
  app.use('/media/images', express.static(path.join(uploadsDir, 'images')));
  app.use('/media/video',  express.static(path.join(uploadsDir, 'video')));
}

app.use('/auth',          require('./routes/auth'));
app.use('/api/sections',  require('./routes/sections'));
app.use('/api/config',    require('./routes/config'));
app.use('/api/navlinks',  require('./routes/navlinks'));
app.use('/api/reditems',  require('./routes/reditems'));
app.use('/api/images',    require('./routes/images'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/upload',        require('./routes/upload'));

app.get('/health', (_, res) =>
  res.json({ status: 'ok', service: 'explore-admin-api' })
);

app.use((req, res) =>
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
);

app.use((err, req, res, next) => {
  console.error('❌', err.message);
  res.status(500).json({ error: err.message });
});

// Solo escucha en local — en Vercel se exporta el app directamente
if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`🔐 Admin API corriendo en http://localhost:${PORT}`)
  );
}

module.exports = app;
