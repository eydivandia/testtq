const express = require('express');
const router = express.Router();
const Statement = require('../models/Statement');

router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.project) filters.project = req.query.project;
    if (req.query.crew) filters.crew = req.query.crew;
    
    const statements = await Statement.find(filters)
      .populate('project', 'projectName projectCode')
      .populate('crew', 'crewName crewLeader')
      .sort('-submissionDate');
    
    res.json(statements);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت صورت وضعیت‌ها' });
  }
});

router.post('/', async (req, res) => {
  try {
    const statement = new Statement(req.body);
    await statement.save();
    
    res.status(201).json({
      message: 'صورت وضعیت با موفقیت ثبت شد',
      statement
    });
  } catch (error) {
    res.status(500).json({ error: 'خطا در ثبت صورت وضعیت' });
  }
});

router.put('/:id/approve', async (req, res) => {
  try {
    const statement = await Statement.findById(req.params.id);
    
    if (!statement) {
      return res.status(404).json({ error: 'صورت وضعیت یافت نشد' });
    }
    
    statement.approvalStatus = 'approved';
    statement.approvalDate = new Date();
    statement.approverName = req.body.approverName;
    
    await statement.save();
    
    res.json({
      message: 'صورت وضعیت تایید شد',
      statement
    });
  } catch (error) {
    res.status(500).json({ error: 'خطا در تایید صورت وضعیت' });
  }
});

module.exports = router;
