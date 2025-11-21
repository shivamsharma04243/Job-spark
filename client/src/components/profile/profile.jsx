// src/modules/auth/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apiconfig/apiconfig.jsx';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchProfile() {
    try {
      const res = await api.get('/auth/me');
      const data = res.data;
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/sign-in');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!user) return (
    <div className="p-6">
      <div>You are not logged in.</div>
      <button onClick={()=>navigate('/sign-in')} className="mt-3 px-3 py-1 bg-blue-600 text-white rounded">Login</button>
    </div>
  );

  const loginTime = user.loginAt ? new Date(user.loginAt).toLocaleString() : '-';

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl mb-3">Profile</h2>
      <div className="mb-2"><strong>ID:</strong> {user.id}</div>
      <div className="mb-2"><strong>Username:</strong> {user.username}</div>
      <div className="mb-2"><strong>Name:</strong> {user.name || '-'}</div>
      <div className="mb-2"><strong>Role:</strong> {user.role || '-'}</div>
      <div className="mb-4"><strong>Logged in at:</strong> {loginTime}</div>

      <div className="flex gap-3">
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded text-white">Logout</button>
      </div>
    </div>
  );
}
