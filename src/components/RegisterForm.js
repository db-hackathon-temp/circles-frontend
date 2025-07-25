import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    retypePassword: '',
    dateOfBirth: '',
    mobile: '',
    email: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};

    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.username.trim()) errs.username = 'Username is required';
    if (!formData.password) errs.password = 'Password is required';
    if (formData.password !== formData.retypePassword) {
      errs.retypePassword = 'Passwords do not match';
    }
    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of Birth is required';
    } else if (new Date(formData.dateOfBirth) >= new Date()) {
      errs.dateOfBirth = 'Date of Birth must be in the past';
    }
    if (!formData.mobile) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errs.mobile = 'Mobile number must be exactly 10 digits';
    }
    if (!formData.email) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Email is invalid';
    }
    if (!formData.role) {
      errs.role = 'Role is required';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            dateOfBirth: new Date(formData.dateOfBirth).toISOString()
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Registration failed:', errorData);
          alert(errorData.message || 'Registration failed');
          return;
        }

        const token = response.headers.get('Authorization');
        console.log(response.headers)
        const data = await response.json();

        console.log('Registration successful:', data);
        console.log('Received token:', token);

        if (token) {
          localStorage.setItem('token', token)
        }

        localStorage.setItem('role', formData.role);
      //  navigate('/dashboard');  // go to dashboard after register
       navigate('/kyc');
      } catch (err) {
        console.error('Error during registration:', err);
        alert('Something went wrong. Please try again later.');
      }
    }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        {errors.firstName && <div className="error">{errors.firstName}</div>}
        {errors.lastName && <div className="error">{errors.lastName}</div>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <div className="error">{errors.username}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error">{errors.email}</div>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div className="error">{errors.password}</div>}

        <input
          type="password"
          name="retypePassword"
          placeholder="Retype Password"
          value={formData.retypePassword}
          onChange={handleChange}
        />
        {errors.retypePassword && <div className="error">{errors.retypePassword}</div>}

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
        {errors.dateOfBirth && <div className="error">{errors.dateOfBirth}</div>}

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
        />
        {errors.mobile && <div className="error">{errors.mobile}</div>}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="" disabled>
            Role
          </option>
          <option value="founder">Founder</option>
          <option value="shark">Shark</option>
        </select>
        {errors.role && <div className="error">{errors.role}</div>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;
