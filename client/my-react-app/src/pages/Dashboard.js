import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientDashboard from '../components/ClientDashboard';
import FreelancerDashboard from '../components/FreelancerDashboard';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dashboard - Welcome, {user.name}!</h2>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      {user.role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />}
    </div>
  );
}

export default Dashboard; 