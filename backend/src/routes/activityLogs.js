const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');

router.get('/', async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'fullName username')
      .sort('-timestamp')
      .limit(500);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت لاگ‌ها' });
  }
});

router.post('/', async (req, res) => {
  try {
    const log = new ActivityLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'خطا در ثبت لاگ' });
  }
});

module.exports = router;
