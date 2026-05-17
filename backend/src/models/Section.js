const { Schema, model } = require('mongoose');

const sectionSchema = new Schema(
  {
    key:       { type: String, required: true, unique: true },
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

module.exports = model('Section', sectionSchema);
