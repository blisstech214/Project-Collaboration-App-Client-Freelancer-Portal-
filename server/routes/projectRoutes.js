const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['client']), projectController.createProject);
router.post('/:id/assign', authMiddleware(['client']), projectController.assignProject);
router.get('/', authMiddleware(['client']), projectController.getClientProjects);
router.get('/assigned', authMiddleware(['freelancer']), projectController.getFreelancerProjects);

module.exports = router; 