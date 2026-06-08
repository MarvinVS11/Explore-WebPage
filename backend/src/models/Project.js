const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  label:     { type: String, required: true },
  href:      { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
}, { _id: true });

const projectSchema = new mongoose.Schema({
  siteId:      { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  order:       { type: Number, default: 0 },
  isVisible:   { type: Boolean, default: true },
  links:       { type: [linkSchema], default: [] },
  imgLeftUrl:  { type: String, default: '' },
  imgRightUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
