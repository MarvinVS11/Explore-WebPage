const mongoose = require('mongoose');

const documentoSchema = new mongoose.Schema({
  siteId:      { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, default: '' },
  fileUrl:     { type: String, required: true },
  fileName:    { type: String, default: '' },
  fileType:    { type: String, default: '' },
  order:       { type: Number, default: 0 },
  isVisible:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Documento', documentoSchema);
