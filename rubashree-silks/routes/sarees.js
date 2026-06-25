const express = require('express');
const Saree = require('../models/Saree');

const router = express.Router();

// GET /api/sarees?type=handloom&search=banarasi
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    const filter = {};
    const term = (search || '').trim().toLowerCase();

    if (term.includes('powerloom')) {
      filter.type = 'powerloom';
    } else if (term.includes('handloom')) {
      filter.type = 'handloom';
    } else if (type === 'handloom' || type === 'powerloom') {
      filter.type = type;
    }

    if (term && !term.includes('handloom') && !term.includes('powerloom')) {
      filter.name = { $regex: term, $options: 'i' };
    }

    const sarees = await Saree.find(filter).sort({ sareeId: 1 });
    res.json(sarees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load the saree collection.' });
  }
});

router.get('/:sareeId', async (req, res) => {
  try {
    const saree = await Saree.findOne({ sareeId: req.params.sareeId });
    if (!saree) return res.status(404).json({ message: 'Saree not found.' });
    res.json(saree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load this saree.' });
  }
});

module.exports = router;
