// src/components/CreateCirclePage.js
import React, { useState } from 'react';
import './CreateCirclePage.css'; // for styling and animation
import { useNavigate } from 'react-router-dom';

function CreateCirclePage() {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    country: '',
    monthlyContribution: '',
    maxMembers: '',
    sharkId: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      ...formData,
      monthlyContribution: parseInt(formData.monthlyContribution),
      maxMembers: parseInt(formData.maxMembers),
      createdByToken: token
    };

    try {
      const res = await fetch('http://localhost:8080/api/circle/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Circle created successfully!");
        navigate('/dashboard');
      } else {
        const error = await res.text();
        alert("Error creating circle: " + error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error while creating circle.");
    }
  };

  return (
    <div className="form-container slide-in">
      <h2>Create a Circle</h2>
      <form onSubmit={handleCreate}>
        <input type="text" name="name" placeholder="Circle Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} required />
        <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
        <input type="number" name="monthlyContribution" placeholder="Monthly Contribution (₹)" value={formData.monthlyContribution} onChange={handleChange} required />
        <input type="number" name="maxMembers" placeholder="Max Members" value={formData.maxMembers} onChange={handleChange} required />
        <input type="text" name="sharkId" placeholder="Shark ID (optional)" value={formData.sharkId} onChange={handleChange} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateCirclePage;
