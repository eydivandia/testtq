const express = require('express');
const router = express.Router();
const Crew = require('../models/Crew');

router.get('/', async (req, res) => {
  try {
    const crews = await Crew.find().sort('-createdAt');
    res.json(crews);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت اکیپ‌ها' });
  }
});

router.post('/', async (req, res) => {
  try {
    const crew = new Crew(req.body);
    await crew.save();
    
    res.status(201).json({
      message: 'اکیپ با موفقیت ایجاد شد',
      crew
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'نام اکیپ تکراری است' });
    }
    res.status(500).json({ error: 'خطا در ایجاد اکیپ' });
  }
});

module.exports = router;
