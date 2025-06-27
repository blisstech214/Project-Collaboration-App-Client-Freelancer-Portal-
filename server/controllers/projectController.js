const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  const { title, description, deadline, freelancerId } = req.body;
  if (!title) return res.status(400).json({ message: 'Project title is required.' });
  try {
    const project = new Project({
      title,
      description,
      deadline,
      clientId: req.user.id,
      freelancerId: freelancerId || null
    });
    await project.save();
    if (freelancerId) {
      const freelancer = await User.findById(freelancerId);
      if (freelancer) {
        freelancer.assignedProjects.push(project._id);
        await freelancer.save();
      }
    }
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.assignProject = async (req, res) => {
  const { freelancerId } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const freelancer = await User.findById(freelancerId);
    if (!freelancer) return res.status(404).json({ message: 'Freelancer not found.' });
    project.freelancerId = freelancerId;
    await project.save();
    freelancer.assignedProjects.push(project._id);
    await freelancer.save();
    res.json({ message: 'Project assigned to freelancer.', project });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getClientProjects = async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getFreelancerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ freelancerId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 