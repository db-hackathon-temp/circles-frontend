import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function FoundersRegistrationForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessDetails: '',
    pitchUrl: '',
    fundingGoal: '',
    agreementSigned: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};

    if (!formData.businessName.trim()) {
      errs.businessName = 'Business Name is required';
    }

    if (!formData.businessDetails.trim()) {
      errs.businessDetails = 'Business Details are required';
    }

    if (!formData.pitchUrl.trim()) {
      errs.pitchUrl = 'Pitch URL is required';
    } else {
      try {
        new URL(formData.pitchUrl);
      } catch (_) {
        errs.pitchUrl = 'Pitch URL must be valid';
      }
    }

    if (!formData.fundingGoal) {
      errs.fundingGoal = 'Funding Goal is required';
    } else if (Number(formData.fundingGoal) <= 0) {
      errs.fundingGoal = 'Funding Goal must be a positive number';
    }

    if (!formData.agreementSigned) {
      errs.agreementSigned = 'You must sign the agreement';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Unauthorized: Please login again');
          navigate('/');
          return;
        }

        const response = await fetch('http://localhost:8080/api/founder/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            token: token,
            businessName: formData.businessName,
            businessDetails: formData.businessDetails,
            pitchUrl: formData.pitchUrl,
            fundingGoal: Number(formData.fundingGoal),
            agreementSigned: formData.agreementSigned
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          console.error('Submission failed:', errData);
          alert(errData.message || 'Submission failed');
          return;
        }

        const data = await response.json();
        console.log('Founder profile submitted successfully:', data);
        alert('Founder Registered successfully');
        navigate('/dashboard');

      } catch (err) {
        console.error('Error during founder profile submission:', err);
        alert('Something went wrong. Please try again.');
      
      }
    }
  };

  return (
    <div className="form-container slide-in right-form">
      <h2>Founders Registration</h2>
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
        />
        {errors.businessName && <div className="error">{errors.businessName}</div>}

        <textarea
          name="businessDetails"
          placeholder="Business Details"
          value={formData.businessDetails}
          onChange={handleChange}
        />
        {errors.businessDetails && <div className="error">{errors.businessDetails}</div>}

        <input
          type="url"
          name="pitchUrl"
          placeholder="Pitch Video URL"
          value={formData.pitchUrl}
          onChange={handleChange}
        />
        {errors.pitchUrl && <div className="error">{errors.pitchUrl}</div>}

        <input
          type="number"
          name="fundingGoal"
          placeholder="Funding Goal (in ₹)"
          value={formData.fundingGoal}
          onChange={handleChange}
        />
        {errors.fundingGoal && <div className="error">{errors.fundingGoal}</div>}

        <label>
          <input
            type="checkbox"
            name="agreementSigned"
            checked={formData.agreementSigned}
            onChange={handleChange}
          />
          Agreement Signed
        </label>
        {errors.agreementSigned && <div className="error">{errors.agreementSigned}</div>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FoundersRegistrationForm;
