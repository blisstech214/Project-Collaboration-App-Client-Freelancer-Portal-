import React, { useState, useEffect } from 'react';

function FreelancerDashboard() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('/api/projects/assigned', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProjects(data);
    };
    fetchProjects();
  }, [token]);

  return (
    <div>
      <h3>Assigned Projects</h3>
      <ul>
        {projects.map(p => (
          <li key={p._id}>
            <b>{p.title}</b> - {p.description} (Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'N/A'})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FreelancerDashboard; 