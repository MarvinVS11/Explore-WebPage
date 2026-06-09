const { Schema, model } = require('mongoose');

const imageSchema = new Schema(
  {
    url:      { type: String, required: true },
    publicId: { type: String, default: '' },
    section:  {
      type: String,
      required: true,
      enum: ['hero', 'nosotros', 'red', 'galeria', 'footer', 'redes'],
    },
    role: {
      type: String,
      default: 'galeria',
      enum: ['hero', 'banner', 'logo', 'portada', 'slider', 'galeria', 'icon'],
    },
    alt:      { type: String, default: '' },
    linkUrl:  { type: String, default: '' },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    siteId:   { type: String, default: 'explore', index: true },
  },
  { timestamps: true }
);

module.exports = model('Image', imageSchema);
