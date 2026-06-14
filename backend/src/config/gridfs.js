const mongoose = require('mongoose');

function getGridFSBucket(bucketName = 'documentos') {
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB no está conectado');
  return new mongoose.mongo.GridFSBucket(db, { bucketName });
}

module.exports = { getGridFSBucket };
