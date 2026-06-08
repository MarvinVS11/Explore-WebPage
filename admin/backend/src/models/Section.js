const { Schema, model } = require('mongoose');

const sectionSchema = new Schema(
  {
    key:       { type: String, required: true },
    siteId:    { type: String, default: 'explore', index: true },
    title:     { type: String, default: '' },
    subtitle:  { type: String, default: '' },
    body:      { type: String, default: '' },
    ctaText:   { type: String, default: '' },
    ctaLink:   { type: String, default: '' },
    isVisible: { type: Boolean, default: true },
    extraData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Índice compuesto: misma key puede existir en distintos sitios
sectionSchema.index({ key: 1, siteId: 1 }, { unique: true });

module.exports = model('Section', sectionSchema);
