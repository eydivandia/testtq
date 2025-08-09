const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Material = require('../models/Material');
const Statement = require('../models/Statement');
const Crew = require('../models/Crew');

router.get('/stats', async (req, res) => {
  try {
    const [projects, materials, statements, crews] = await Promise.all([
      Project.countDocuments(),
      Material.countDocuments(),
      Statement.countDocuments(),
      Crew.countDocuments()
    ]);
    
    res.json({
      totalProjects: projects,
      activeProjects: await Project.countDocuments({ status: 'active' }),
      totalMaterials: materials,
      totalCrews: crews,
      pendingStatements: await Statement.countDocuments({ approvalStatus: 'pending' })
    });
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت آمار' });
  }
});

module.exports = router;
