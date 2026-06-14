const mongoose = require('mongoose');

const sitioRecreacionSchema = new mongoose.Schema({
  siteId:      { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl:    { type: String, default: '' },
  mapsUrl:     { type: String, default: '' },
  linkUrl:     { type: String, default: '' },
  order:       { type: Number, default: 0 },
  isVisible:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SitioRecreacion', sitioRecreacionSchema);
