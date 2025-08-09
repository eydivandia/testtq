const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت کاربران' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }
    
    res.json({
      message: 'کاربر بروزرسانی شد',
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'خطا در بروزرسانی کاربر' });
  }
});

module.exports = router;
