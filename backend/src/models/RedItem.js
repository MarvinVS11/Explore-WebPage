const { Schema, model } = require('mongoose');

const redItemSchema = new Schema(
  {
    label:       { type: String, required: true },
    href:        { type: String, default: '' },
    type: {
      type: String,
      default: 'internal',
      enum: ['internal', 'external', 'pdf'],
    },
    iconUrl:     { type: String, default: '' },
    documentUrl: { type: String, default: '' },
    order:       { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model('RedItem', redItemSchema);