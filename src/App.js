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
    <div className="app">
      <header className="app-header">
        <div className="brand" onClick={() => {
          setActiveForm('');
          navigate('/');
        }}>
          <img src="../images/SharkCircle1.png" alt="SharkCircles Logo" className="logo" />
          <h1>Shark Circles</h1>
        </div>
        <nav>
          {!isAuthenticated && !activeForm && (
            <>
              <button onClick={() => handleNavigation('login')}>Login</button>
              <button onClick={() => handleNavigation('register')}>Register</button>
            </>
          )}
          {isAuthenticated && (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              !activeForm ? (
                <p className="welcome">Welcome! Please Login or Register.</p>
              ) : activeForm === 'login' ? (
                <div className="form-wrapper"><LoginForm /></div>
              ) : (
                <div className="form-wrapper"><RegisterForm /></div>
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

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} SharkCircles</p>
      </footer>
    </div>
  );
}

export default App;