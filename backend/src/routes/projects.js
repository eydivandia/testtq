const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت پروژه‌ها' });
  }
});

router.post('/', async (req, res) => {
  try {
    const projectData = req.body;
    
    if (projectData.blocks) {
      projectData.blocks = projectData.blocks.map(block => ({
        name: block.name || block,
        customName: block.customName || block.name || block,
        floors: Array.from({ length: projectData.numberOfFloors }, (_, i) => ({
          number: i + 1,
          status: 'not_started',
          progress: 0
        }))
      }));
    }
    
    const project = new Project(projectData);
    await project.save();
    
    res.status(201).json({
      message: 'پروژه با موفقیت ایجاد شد',
      project
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'کد پروژه تکراری است' });
    }
    res.status(500).json({ error: 'خطا در ایجاد پروژه' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'پروژه یافت نشد' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت پروژه' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'پروژه یافت نشد' });
    }
    
    res.json({
      message: 'پروژه با موفقیت بروزرسانی شد',
      project
    });
  } catch (error) {
    res.status(500).json({ error: 'خطا در بروزرسانی پروژه' });
  }
});

router.put('/:id/wbs', async (req, res) => {
  try {
    const { wbs } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'پروژه یافت نشد' });
    }
    
    project.wbs = wbs;
    project.overallProgress = project.calculateProgressFromWBS();
    await project.save();
    
    res.json({
      message: 'ساختار شکست بروزرسانی شد',
      project
    });
  } catch (error) {
    res.status(500).json({ error: 'خطا در بروزرسانی ساختار شکست' });
  }
});

module.exports = router;
