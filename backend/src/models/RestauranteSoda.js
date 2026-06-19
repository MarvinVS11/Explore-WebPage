const mongoose = require('mongoose');

const restauranteSodaSchema = new mongoose.Schema({
  siteId:    { type: String, required: true },
  nombre:    { type: String, required: true },
  telefono:  { type: String, default: '' },
  distrito:  { type: String, default: '' },
  canton:    { type: String, default: '' },
  order:     { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('RestauranteSoda', restauranteSodaSchema);
