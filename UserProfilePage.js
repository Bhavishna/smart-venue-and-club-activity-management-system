// client/src/components/UserProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(res.data);
      } catch {
        setError('Cannot load user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p>Loading profile…</p>;
  if (error)   return <p>{error}</p>;

  return (
    <div className="profile-container">
      <button onClick={()=>navigate(-1)}>← Back</button>
      <h2>{user.name}</h2>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Department:</strong> {user.department}</p>
      {user.role === 'student' && (
        <>
          <p><strong>Roll No:</strong> {user.rollno}</p>
          <p><strong>Batch:</strong> {user.batch}</p>
          <p><strong>Class:</strong> {user.studentClass}</p>
        </>
      )}
      {user.role === 'staff' && (
        <p><strong>Staff ID:</strong> {user.staffId}</p>
      )}
      {/* Add more profile fields here as needed */}
    </div>
  );
};

export default UserProfilePage;
