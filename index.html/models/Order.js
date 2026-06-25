const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sareeId: { type: String, required: true },
    sareeName: { type: String, required: true },
    price: { type: Number, required: true },
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
