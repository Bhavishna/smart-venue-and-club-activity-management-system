// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['student','staff','admin'], required: true },

  // Student‐specific
  rollno:        { type: String, unique: true, sparse: true },
  department:    { type: String },
  batch:         { type: String },
  studentClass:  { type: String },        // e.g. "CS101", "Year 2" etc.

  // Staff‐specific
  staffId:       { type: String, unique: true, sparse: true },

  // Profile fields to be filled post‐login
  name:       { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  phone:      { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
