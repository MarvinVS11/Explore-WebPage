const mongoose = require('mongoose');

const NavLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  order: { type: Number, default: 0 },
  target: { type: String, default: '_self' },
  isExternal: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('NavLink', NavLinkSchema);
