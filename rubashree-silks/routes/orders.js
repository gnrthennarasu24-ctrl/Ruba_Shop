const express = require('express');
const Order = require('../models/Order');
const Saree = require('../models/Saree');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const { sareeId, name, address, mobile } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ field: 'name', message: 'Enter the name for delivery.' });
    }
    if (!address || address.trim().length < 8) {
      return res.status(400).json({ field: 'address', message: 'Enter a complete delivery address.' });
    }
    if (!/^[6-9]\d{9}$/.test(mobile || '')) {
      return res.status(400).json({ field: 'mobile', message: 'Enter a valid 10-digit Indian mobile number.' });
    }

    const saree = await Saree.findOne({ sareeId });
    if (!saree) {
      return res.status(404).json({ message: 'That saree could not be found.' });
    }

    const orderId = 'RS-' + Math.floor(100000 + Math.random() * 900000);

    const order = await Order.create({
      orderId,
      user: req.userId,
      sareeId: saree.sareeId,
      sareeName: saree.name,
      price: saree.price,
      customerName: name.trim(),
      address: address.trim(),
      mobile,
    });

    res.status(201).json({
      orderId: order.orderId,
      sareeName: order.sareeName,
      price: order.price,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong placing your order.' });
  }
});

router.get('/mine', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load your orders.' });
  }
});

module.exports = router;
