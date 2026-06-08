const { Schema, model } = require('mongoose');

const navLinkSchema = new Schema(
  {
    label:    { type: String, required: true },
    href:     { type: String, required: true },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    siteId:   { type: String, default: 'explore', index: true },
  },
  { timestamps: true }
);

module.exports = model('NavLink', navLinkSchema);
