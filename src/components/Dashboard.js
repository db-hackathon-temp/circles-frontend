import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [userType, setUserType] = useState('');
  const [myCircles, setMyCircles] = useState([]);

 useEffect(() => {
  const storedType = localStorage.getItem('role');
  setUserType(storedType);

  const token = localStorage.getItem('token'); 
  const fetchCircles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/circle/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch circles');
      }
console.log(storedType)
      const data = await response.json();
      setMyCircles(data);
    } catch (error) {
      console.error('Error fetching circles:', error);
    }
  };

  fetchCircles();
}, []);


  const handlePayNow = (circleName) => {
    alert(`Redirecting to payment for ${circleName}`);
    // TODO: Payment logic
  };

  return (
    <div className="dashboard-container">
      {/* Header with user type */}
       <div className="button-row">
             <Link to="/available-circles" className="nav-button">
          Available Circles
        </Link>
        <Link to="/create-circle" className="nav-button">
  Create Circle
</Link>
 <Link to="/available-sharks" className="nav-button">Available Sharks</Link>
    <Link to="/available-founders" className="nav-button">Available Founders</Link>
          </div>
      <div className="dashboard-header">
        <div>
          <h2>Welcome {userType === 'founder' ? 'Founder' : userType === 'shark' ? 'Shark' : 'User'}</h2>
          <p>Your Dashboard</p>
        </div>
         
       

      </div>

      <h3>My Circles</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Circle Name</th>
            <th>Number of Members</th>
            <th>Max Members</th>
            <th>Industry</th>
            <th>Contribution Amount</th>
            <th>Shark Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {myCircles.map((circle, index) => (
            <tr key={index}>
              <td>{circle.name}</td>
              <td>{circle.members?.length || 0}</td>
              <td>{circle.maxMember}</td>
              <td>{circle.industry}</td>
              <td>₹{circle.monthlyPayout}</td>
              <td>{circle.sharkName || '—'}</td>
              <td>
                <button onClick={() => handlePayNow(circle.name)}>
                  Pay Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
