import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function SharksRegistrationForm() {
  const [formData, setFormData] = useState({
    monthlyCommitment: '',
    sectorPreference: '',
    preferredCountries: '',
    payoutMode: '',
    agreementSigned: false,
    participationContract: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};

    if (!formData.monthlyCommitment) {
      errs.monthlyCommitment = 'Monthly commitment is required';
    } else if (Number(formData.monthlyCommitment) <= 0) {
      errs.monthlyCommitment = 'Commitment must be a positive number';
    }

    if (!formData.sectorPreference.trim()) {
      errs.sectorPreference = 'Sector preference is required';
    }

    if (!formData.preferredCountries.trim()) {
      errs.preferredCountries = 'Preferred countries is required';
    }

    if (!formData.payoutMode.trim()) {
      errs.payoutMode = 'Payout mode is required';
    }

    if (!formData.agreementSigned) {
      errs.agreementSigned = 'You must sign the agreement';
    }

    if (!formData.participationContract.trim()) {
      errs.participationContract = 'Participation contract ID is required';
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
      const token = localStorage.getItem('token');

      if (!token) {
        alert("User not authenticated.");
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/shark/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            monthlyCommitment: Number(formData.monthlyCommitment),
            sectorPreference: formData.sectorPreference,
            preferredCountries: formData.preferredCountries,
            payoutMode: formData.payoutMode,
            agreementSigned: formData.agreementSigned,
            participationContract: formData.participationContract,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Submission failed:', error);
          alert(error.message || 'Shark profile submission failed');
          return;
        }

        console.log('Shark profile submitted successfully');
        navigate('/dashboard');
      } catch (err) {
        console.error('Error submitting shark profile:', err);
        alert('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <div className="form-container slide-in right-form">
      <h2>Shark Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="monthlyCommitment"
          placeholder="Monthly Commitment (in ₹)"
          value={formData.monthlyCommitment}
          onChange={handleChange}
        />
        {errors.monthlyCommitment && <div className="error">{errors.monthlyCommitment}</div>}

        <input
          type="text"
          name="sectorPreference"
          placeholder="Sector Preference"
          value={formData.sectorPreference}
          onChange={handleChange}
        />
        {errors.sectorPreference && <div className="error">{errors.sectorPreference}</div>}

        <input
          type="text"
          name="preferredCountries"
          placeholder="Preferred Countries"
          value={formData.preferredCountries}
          onChange={handleChange}
        />
        {errors.preferredCountries && <div className="error">{errors.preferredCountries}</div>}

        <input
          type="text"
          name="payoutMode"
          placeholder="Payout Mode"
          value={formData.payoutMode}
          onChange={handleChange}
        />
        {errors.payoutMode && <div className="error">{errors.payoutMode}</div>}

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

        <input
          type="text"
          name="participationContract"
          placeholder="Participation Contract ID"
          value={formData.participationContract}
          onChange={handleChange}
        />
        {errors.participationContract && <div className="error">{errors.participationContract}</div>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SharksRegistrationForm;
