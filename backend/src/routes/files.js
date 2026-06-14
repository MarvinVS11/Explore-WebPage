const router   = require('express').Router();
const mongoose = require('mongoose');

const { ObjectId } = mongoose.mongo;

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'documentos' });
    const objId  = new ObjectId(id);

    const files = await bucket.find({ _id: objId }).toArray();
    if (!files.length) return res.status(404).json({ error: 'Archivo no encontrado' });

    const file = files[0];
    res.set('Content-Type',        file.contentType || 'application/octet-stream');
    res.set('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(file.filename)}`);
    res.set('Content-Length',      file.length);
    res.set('Cache-Control',       'public, max-age=31536000');

    bucket.openDownloadStream(objId).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
