import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // Step 1: Login API call
    const response = await fetch(`http://localhost:8080/api/auth/login?username=${email}&password=${password}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    // Assuming backend returns token as plain text
    const token = await response.text();
    console.log('Login successful, token:', token);

    // Step 2: Store token
    localStorage.setItem('token', token);

    // Step 3: Call user-details API with token in Authorization header
    const userDetailsResponse = await fetch('http://localhost:8080/api/auth/user-details', {
      headers: {
        'Authorization': `${token}`,  // Most APIs expect "Bearer <token>"
      },
    });

    if (!userDetailsResponse.ok) {
      throw new Error('Failed to fetch user details');
    }

    const userDetails = await userDetailsResponse.json();
    console.log('User details:', userDetails);

    // Optionally, save role in localStorage for routing in App
    if (userDetails.role) {
      localStorage.setItem('role', userDetails.role);
    }
 alert('User logged in Successfully');
    // Step 4: Navigate based on role
    if (userDetails.role === 'Founder') {
      navigate('/founders-registration');
    } else if (userDetails.role === 'Shark') {
      navigate('/sharks-registration');
    } else {
      navigate('/dashboard');
    }

  } catch (error) {
    console.error('Login error:', error.message);
      alert(error.message);
  }
};


  return (
    <div>
      <h2>User Login</h2>
      <form onSubmit={handleLogin}>
        <input
          // type="email"
          placeholder="User Name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;