const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort('-createdAt')
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت اعلان‌ها' });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'اعلان یافت نشد' });
    }
    
    notification.isRead.push({
      user: req.body.userId,
      readAt: new Date()
    });
    
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'خطا در بروزرسانی اعلان' });
  }
});

module.exports = router;
