const router = require('express').Router();
const https  = require('https');
const http   = require('http');

const ALLOWED_HOST = 'res.cloudinary.com';

router.get('/', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Falta el parámetro url' });

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: 'URL inválida' });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return res.status(403).json({ error: 'Dominio no permitido' });
  }

  const client = parsed.protocol === 'https:' ? https : http;

  client.get(url, (upstream) => {
    const status = upstream.statusCode;
    if (status !== 200) {
      res.status(status || 502).json({ error: `Error al obtener el archivo: ${status}` });
      upstream.resume();
      return;
    }

    res.set('Content-Type',        'application/pdf');
    res.set('Content-Disposition', 'inline');
    res.set('Cache-Control',       'public, max-age=86400');

    const cl = upstream.headers['content-length'];
    if (cl) res.set('Content-Length', cl);

    upstream.pipe(res);
  }).on('error', (err) => {
    if (!res.headersSent) res.status(502).json({ error: err.message });
  });
});

module.exports = router;
