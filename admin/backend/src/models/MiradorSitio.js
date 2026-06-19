const mongoose = require('mongoose');

const miradorSitioSchema = new mongoose.Schema({
  siteId:    { type: String, required: true },
  sitio:     { type: String, required: true },
  canton:    { type: String, default: '' },
  order:     { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MiradorSitio', miradorSitioSchema);
