const router     = require('express').Router();
const https      = require('https');
const cloudinary = require('../config/cloudinary');

const ALLOWED_HOST = 'res.cloudinary.com';

function parseCloudinaryUrl(url) {
  const match = url.match(
    /res\.cloudinary\.com\/[^/]+\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+)$/
  );
  if (!match) return null;
  return { resourceType: match[1], publicId: match[2] };
}

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

  const parts = parseCloudinaryUrl(url);
  if (!parts) return res.status(400).json({ error: 'URL de Cloudinary no reconocida' });

  const resourceType = parts.resourceType;
  const publicId     = decodeURIComponent(parts.publicId);

  let signedUrl;
  try {
    signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      type:          'upload',
      sign_url:      true,
      secure:        true,
    });
  } catch (err) {
    console.error('[pdf proxy] Error generando URL firmada:', err.message);
    return res.status(500).json({ error: 'Error generando URL firmada: ' + err.message });
  }

  https.get(signedUrl, (upstream) => {
    const status = upstream.statusCode;
    if (status !== 200) {
      console.error('[pdf proxy] Cloudinary respondió:', status, 'para', signedUrl);
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
    console.error('[pdf proxy] Error fetch:', err.message);
    if (!res.headersSent) res.status(502).json({ error: err.message });
  });
});

module.exports = router;
