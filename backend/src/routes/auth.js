const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ error: 'حساب کاربری غیرفعال است' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret-key'
    );
    
    user.lastLogin = new Date();
    await user.save();
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطا در ورود' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    
    if (userData.expiryType === 'hourly') {
      userData.expiryDate = new Date(Date.now() + 60 * 60 * 1000);
    } else if (userData.expiryType === 'daily') {
      userData.expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    
    const user = new User(userData);
    await user.save();
    
    res.status(201).json({
      message: 'کاربر با موفقیت ایجاد شد',
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'نام کاربری تکراری است' });
    }
    res.status(500).json({ error: 'خطا در ایجاد کاربر' });
  }
});

module.exports = router;
