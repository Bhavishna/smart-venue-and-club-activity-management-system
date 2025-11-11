// client/src/components/UserManagementPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './UserManagementPage.css';

const UserManagementPage = () => {
  // 1) Choose student vs staff
  const [roleTab, setRoleTab] = useState('student');

  // 2) Choose sub-view: view list vs add form
  const [subTab, setSubTab] = useState('view');

  // 3) Filters & data
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [dept, setDept]     = useState('');
  const [batch, setBatch]   = useState('');
  const [stuClass, setStuClass] = useState('');

  // 4) Form state for add
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    department: '', rollno:'', batch:'', studentClass:'', staffId:''
  });

  // Fetch list when viewing and filters change
  useEffect(() => {
    if (subTab !== 'view') return;
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const params = { role: roleTab };
        if (dept)      params.department = dept;
        if (roleTab==='student') {
          if (batch)      params.batch        = batch;
          if (stuClass)   params.studentClass = stuClass;
        }
        const res = await axios.get('http://localhost:5000/api/users', { params });
        setUsers(res.data);
      } catch {
        setError('Could not load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [subTab, roleTab, dept, batch, stuClass]);

  const onFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onAddUser = async e => {
    e.preventDefault();
    try {
      const payload = {
        name:       form.name,
        email:      form.email,
        password:   form.password,
        role:       roleTab,
        department: form.department,
        ...(roleTab==='student'
          ? {
              rollno: form.rollno,
              batch: form.batch,
              studentClass: form.studentClass
            }
          : { staffId: form.staffId }
        )
      };
      await axios.post('http://localhost:5000/api/users/add', payload);
      alert('User added!');
      setForm({ name:'', email:'', password:'', department:'', rollno:'', batch:'', studentClass:'', staffId:'' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding user');
    }
  };

  return (
    <div className="ump-container">
      <h2>User Management (Admin)</h2>

      {/* Role selector */}
      <div className="tabs">
        {['student','staff'].map(r => (
          <button
            key={r}
            className={roleTab===r ? 'active' : ''}
            onClick={()=>{
              setRoleTab(r);
              setDept(''); setBatch(''); setStuClass('');
            }}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}s
          </button>
        ))}
      </div>

      {/* Sub-view selector */}
      <div className="tabs sub-tabs">
        <button className={subTab==='view' ? 'active' : ''} onClick={()=>setSubTab('view')}>
          View {roleTab==='student'?'Students':'Staff'}
        </button>
        <button className={subTab==='add' ? 'active' : ''} onClick={()=>setSubTab('add')}>
          Add {roleTab==='student'?'Student':'Staff'}
        </button>
      </div>

      {subTab === 'add' ? (
        // --- ADD FORM ---
        <form className="add-form" onSubmit={onAddUser}>
          <h3>Add {roleTab==='student'?'Student':'Staff'}</h3>
          <label>Name:       <input name="name" value={form.name} onChange={onFormChange} required/></label>
          <label>Email:      <input name="email" value={form.email} onChange={onFormChange} required/></label>
          <label>Password:   <input type="password" name="password" value={form.password} onChange={onFormChange} required/></label>
          <label>Department:<input name="department" value={form.department} onChange={onFormChange} required/></label>

          {roleTab==='student' ? (
            <>
              <label>Roll No: <input name="rollno" value={form.rollno} onChange={onFormChange} required/></label>
              <label>Batch:   <input name="batch" value={form.batch} onChange={onFormChange} required/></label>
              <label>Class:   <input name="studentClass" value={form.studentClass} onChange={onFormChange} required/></label>
            </>
          ) : (
            <label>Staff ID: <input name="staffId" value={form.staffId} onChange={onFormChange} required/></label>
          )}

          <button type="submit">Create</button>
        </form>
      ) : (
        // --- VIEW & FILTER ---
        <>
          <div className="filters">
            <label>Department: <input value={dept} onChange={e=>setDept(e.target.value)}/></label>
            {roleTab==='student' && <>
              <label>Batch: <input value={batch} onChange={e=>setBatch(e.target.value)}/></label>
              <label>Class: <input value={stuClass} onChange={e=>setStuClass(e.target.value)}/></label>
            </>}
          </div>

          {loading ? <p>Loading…</p> : (
            <>
              <p>Total {roleTab}s: {users.length}</p>
              <table className="ump-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Dept</th>
                    {roleTab==='student' && <><th>Roll</th><th>Batch</th><th>Class</th></>}
                    {roleTab==='staff'   && <th>Staff ID</th>}
                    <th>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.department}</td>
                      {roleTab==='student' && <>
                        <td>{u.rollno}</td><td>{u.batch}</td><td>{u.studentClass}</td>
                      </>}
                      {roleTab==='staff' && <td>{u.staffId}</td>}
                      <td>
                        <Link to={`/users/${u._id}`}>View Profile</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
