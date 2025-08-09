const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Material = require('../models/Material');
const Statement = require('../models/Statement');
const Crew = require('../models/Crew');

router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'خطا در تولید گزارش' });
  }
});

router.get('/materials', async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'خطا در تولید گزارش' });
  }
});

router.get('/statements', async (req, res) => {
  try {
    const statements = await Statement.find()
      .populate('project')
      .populate('crew');
    res.json(statements);
  } catch (error) {
    res.status(500).json({ error: 'خطا در تولید گزارش' });
  }
});

module.exports = router;
