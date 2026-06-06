const multer = require('multer');

const ALLOWED = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/ogg',
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Formato no permitido: ${file.mimetype}`), false);
  }
};

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 150 * 1024 * 1024 },
});
