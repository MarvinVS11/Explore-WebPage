const { Schema, model } = require('mongoose');

const redItemSchema = new Schema(
  {
    label:    { type: String, required: true },
    href:     { type: String, required: true },
    type: {
      type:    String,
      default: 'internal',
      enum:    ['internal', 'external', 'pdf'],
    },
    iconUrl:  { type: String, default: '' },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    siteId:   { type: String, default: 'explore', index: true },
  },
  { timestamps: true }
);

module.exports = model('RedItem', redItemSchema);
