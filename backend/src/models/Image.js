const { Schema, model } = require('mongoose');

const imageSchema = new Schema(
  {
    url:      { type: String, required: true },
    section:  {
      type: String,
      required: true,
      enum: ['hero', 'nosotros', 'hospedajes', 'recreacion', 'restaurantes', 'red', 'galeria', 'footer', 'redes', 'explore-occidente'],
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
  },
  { timestamps: true }
);

module.exports = model('Image', imageSchema);
