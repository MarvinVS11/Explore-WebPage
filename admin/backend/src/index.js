require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const fs        = require('fs');
const connectDB = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 5001;

connectDB();

// Asegurar que existen las carpetas de uploads
const uploadsDir = path.join(__dirname, '../uploads');
['images', 'video'].forEach(folder => {
  const dir = path.join(uploadsDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    process.env.ADMIN_FRONTEND_URL,
  ].filter(Boolean),
  methods:     ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Servir archivos subidos (imágenes y videos)
app.use('/media/images', express.static(path.join(uploadsDir, 'images')));
app.use('/media/video',  express.static(path.join(uploadsDir, 'video')));

app.use('/auth',         require('./routes/auth'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/config',   require('./routes/config'));
app.use('/api/navlinks', require('./routes/navlinks'));
app.use('/api/reditems', require('./routes/reditems'));
app.use('/api/images',   require('./routes/images'));
app.use('/upload',       require('./routes/upload'));

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

app.listen(PORT, () =>
  console.log(`🔐 Admin API corriendo en http://localhost:${PORT}`)
);
