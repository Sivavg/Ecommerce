const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// Register/Login with Firebase UID
router.post('/google-login', async (req, res) => {
  try {
    console.log('📥 Received login request:', req.body); // Debug log
    
    const { uid, email, displayName, photoURL } = req.body;

    // Validate required fields
    if (!uid || !email || !displayName) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { uid: !!uid, email: !!email, displayName: !!displayName }
      });
    }

    console.log('🔍 Looking for user with UID:', uid);
    let user = await User.findOne({ uid });

    if (!user) {
      console.log('👤 Creating new user...');
      user = new User({
        uid,
        email,
        displayName,
        photoURL,
      });
      await user.save();
      console.log('✅ User created successfully:', user._id);
    } else {
      console.log('✅ User found:', user._id);
    }

    const token = jwt.sign(
      { userId: user._id, uid: user.uid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('🎫 Token generated successfully');

    res.json({
      token,
      user: {
        id: user._id,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Full Error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      details: error.toString()
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v');
    res.json(user);
  } catch (error) {
    console.error('❌ GET USER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
