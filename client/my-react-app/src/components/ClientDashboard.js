import React, { useState, useEffect } from 'react';

function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    const res = await fetch('/api/projects', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setProjects(data);
  };

  const fetchFreelancers = async () => {
    const res = await fetch('/api/users/freelancers', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setFreelancers(data);
  };

  useEffect(() => {
    fetchProjects();
    fetchFreelancers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, deadline, freelancerId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create project');
      setSuccess('Project created!');
      setTitle(''); setDescription(''); setDeadline(''); setFreelancerId('');
      fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const getFreelancerName = (freelancerId) => {
    const freelancer = freelancers.find(f => f._id === freelancerId);
    return freelancer ? freelancer.name : 'Unknown';
  };

  return (
    <div>
      <h3>Create Project</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
        <select value={freelancerId} onChange={e => setFreelancerId(e.target.value)}>
          <option value="">Select a freelancer (optional)</option>
          {freelancers.map(f => (
            <option key={f._id} value={f._id}>{f.name} ({f.email})</option>
          ))}
        </select>
        <button type="submit">Create</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
      <h3>Your Projects</h3>
      <ul>
        {projects.map(p => (
          <li key={p._id}>
            <b>{p.title}</b> - {p.description} (Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'N/A'})<br/>
            Assigned to: {p.freelancerId ? getFreelancerName(p.freelancerId) : 'Unassigned'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientDashboard; 