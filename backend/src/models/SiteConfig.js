const mongoose = require('mongoose');

const SiteConfigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  logo: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  heroImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  navLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NavLink' }],
  redItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RedItem' }],
  metadata: {
    description: { type: String },
    keywords: [{ type: String }],
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SiteConfig', SiteConfigSchema);
