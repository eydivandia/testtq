const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

router.get('/', async (req, res) => {
  try {
    const materials = await Material.find().sort('-purchaseDate');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت مصالح' });
  }
});

router.post('/', async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    
    res.status(201).json({
      message: 'مصالح با موفقیت ثبت شد',
      material
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'شماره فاکتور تکراری است' });
    }
    res.status(500).json({ error: 'خطا در ثبت مصالح' });
  }
});

router.post('/:materialId/allocate', async (req, res) => {
  try {
    const { materialId } = req.params;
    const { allocatedTo, quantity } = req.body;
    
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ error: 'مصالح یافت نشد' });
    }
    
    if (material.currentStock < quantity) {
      return res.status(400).json({ error: 'موجودی کافی نیست' });
    }
    
    material.allocations.push({
      allocatedTo,
      quantity
    });
    
    material.currentStock -= quantity;
    await material.save();
    
    res.json({
      message: 'تخصیص با موفقیت انجام شد',
      material
    });
  } catch (error) {
    res.status(500).json({ error: 'خطا در تخصیص مصالح' });
  }
});

module.exports = router;
