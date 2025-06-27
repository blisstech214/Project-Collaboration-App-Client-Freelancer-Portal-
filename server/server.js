const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Project = require('./models/Project');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const auth = (roles = []) => async (req, res, next) => {
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware to check authentication and role
const authMiddleware = (roles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role.' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Register route
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    const user = new User({ name, email, password, role });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a project (client only)
app.post('/projects', authMiddleware(['client']), async (req, res) => {
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
    // Optionally assign to freelancer
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
});

// Assign a project to a freelancer (client only)
app.post('/projects/:id/assign', authMiddleware(['client']), async (req, res) => {
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
});

// Client: View all their created projects
app.get('/projects', authMiddleware(['client']), async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Freelancer: View only assigned projects
app.get('/assigned-projects', authMiddleware(['freelancer']), async (req, res) => {
  try {
    const projects = await Project.find({ freelancerId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));