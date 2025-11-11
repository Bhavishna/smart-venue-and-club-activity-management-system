// server/routes/users.js
const express  = require('express');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const router   = express.Router();

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID (for admin to view profile)
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('GET /api/users/:id error:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/users
 * @desc    Get all users filtered by query params
 *          ?role=student|staff
 *          &department=...
 *          &batch=...           (students only)
 *          &studentClass=...    (students only)
 */
router.get('/', async (req, res) => {
  try {
    const { role, department, batch, studentClass } = req.query;
    let filter = {};
    if (role)         filter.role = role;
    if (department)   filter.department = department;
    if (role === 'student') {
      if (batch)        filter.batch        = batch;
      if (studentClass) filter.studentClass = studentClass;
    }
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    console.error('GET /api/users error:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/users/add
 * @desc    Admin adds a new student or staff
 */
router.post('/add', async (req, res) => {
  const {
    name, email, password, role, department,
    rollno, batch, studentClass, staffId
  } = req.body;

  try {
    // 1) Check existing
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    // 2) Hash
    const salt   = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // 3) Build user
    const newUser = new User({
      name,
      email,
      password: hashed,
      role,
      department,
      rollno:       role==='student' ? rollno       : undefined,
      batch:        role==='student' ? batch        : undefined,
      studentClass: role==='student' ? studentClass : undefined,
      staffId:      role==='staff'   ? staffId      : undefined
    });

    // 4) Save
    await newUser.save();

    // 5) Respond
    res.status(201).json({
      msg: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        rollno: newUser.rollno,
        batch: newUser.batch,
        studentClass: newUser.studentClass,
        staffId: newUser.staffId
      }
    });
  } catch (err) {
    console.error('POST /api/users/add error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
