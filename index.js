const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allows requests from your React frontend
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusConnectDB';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));


// --- Routes will go here ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
