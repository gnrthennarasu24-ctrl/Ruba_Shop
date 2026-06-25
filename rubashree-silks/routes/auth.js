const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function makeToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ field: 'name', message: 'Tell us your name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ field: 'email', message: 'Enter an email address.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ field: 'password', message: 'Password needs at least 6 characters.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ field: 'email', message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: cleanEmail, passwordHash });

    res.status(201).json({
      token: makeToken(user),
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong creating your account.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ field: 'email', message: 'No account with that email yet — try signing up instead.' });
    }

    const passwordOk = await bcrypt.compare(password || '', user.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ field: 'password', message: "That password doesn't match this account." });
    }

    res.json({
      token: makeToken(user),
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong logging you in.' });
  }
});

module.exports = router;
