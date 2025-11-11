// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & return token + user info
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Check password
    let isMatch;
    // Temporary plain-text admin initial check
    if (!user.password.startsWith('$2a$') && password === user.password) {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Build JWT payload
    const payload = {
      user: {
        id:   user.id,
        role: user.role
      }
    };

    // 4. Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'yourSecretKey',
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id:    user.id,
            role:  user.role,
            name:  user.name || '',    // blank for admin
            email: user.email
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
