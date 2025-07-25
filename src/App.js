import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import KYCPage from './components/KYCPage';
import FoundersRegistrationPage from './components/FoundersRegistrationPage';
import SharksRegistrationPage from './components/SharksRegistrationPage';
import './App.css';
import AvailableCircles from './components/AvailableCircles';
import Dashboard from './components/Dashboard';
import CreateCirclePage from './components/CreateCirclePage';

function App() {
  const [activeForm, setActiveForm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleNavigation = (form) => {
    setActiveForm(form);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setActiveForm('');
    navigate('/');
  };

  return (
    <div className="container">
      <header className="header">
        <div className='mainhead'>
          <img src="../images/SharkCircle1.png" alt="SharkCircles Logo" className="logo" />
          <h1>SharkCircles</h1>
        </div>

        <nav>
          {!isAuthenticated && !activeForm && (
            <>
              <button onClick={() => handleNavigation('login')}>Login</button>
              <button onClick={() => handleNavigation('register')}>Register</button>
            </>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                marginLeft: '10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              !activeForm ? (
                <div className="welcome">Welcome! Please Login or Register.</div>
              ) : activeForm === 'login' ? (
                <div className="form-wrapper slide-in right-form"><LoginForm /></div>
              ) : (
                <div className="form-wrapper slide-in right-form"><RegisterForm /></div>
              )
            }
          />
          <Route path="/kyc" element={<KYCPage />} />
          <Route path="/founders-registration" element={<FoundersRegistrationPage />} />
          <Route path="/sharks-registration" element={<SharksRegistrationPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/available-circles" element={<AvailableCircles />} />
          <Route path="/create-circle" element={<CreateCirclePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
