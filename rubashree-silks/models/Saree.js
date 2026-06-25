const mongoose = require('mongoose');

const sareeSchema = new mongoose.Schema({
  sareeId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['handloom', 'powerloom'], required: true },
  weave: { type: String, required: true },
  descriptor: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  colorA: { type: String, required: true },
  colorB: { type: String, required: true },
  seed: { type: Number, required: true },
});

module.exports = mongoose.model('Saree', sareeSchema);
