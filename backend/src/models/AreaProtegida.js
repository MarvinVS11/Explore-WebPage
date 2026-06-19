const mongoose = require('mongoose');

const areaProtegidaSchema = new mongoose.Schema({
  siteId:    { type: String, required: true },
  nombre:    { type: String, required: true },
  order:     { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('AreaProtegida', areaProtegidaSchema);
