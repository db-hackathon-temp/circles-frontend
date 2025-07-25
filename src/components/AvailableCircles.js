import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function AvailableCircles() {
  const [circles, setCircles] = useState([]);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const storedType = localStorage.getItem('userType');
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

        const data = await response.json();
        setCircles(data);
      } catch (error) {
        console.error('Error fetching circles:', error);
      }
    };

    fetchCircles();
  }, []);

  const handleJoin = (circleId) => {
    alert(`Joining circle with ID: ${circleId}`);
  };

  return (
    <div className="dashboard-container">
      <h2>Available Circles</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Circle Name</th>
            <th>Number of Members</th>
            <th>Max Members</th>
            <th>Industry</th>
            <th>Country</th>
            <th>Monthly Contribution</th>
            <th>Shark Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {circles.map((circle, index) => (
            <tr key={circle.id || index}>
              <td>{circle.name}</td>
              <td>{circle.memberCount}</td>
              <td>{circle.maxMembers}</td>
              <td>{circle.industry}</td>
              <td>{circle.country}</td>
              <td>₹{circle.monthlyContribution}</td>
              <td>{circle.sharkName || '—'}</td>
              <td>
                <button onClick={() => handleJoin(circle.id)} style={{ backgroundColor: '#1e90ff', color: 'white' }}>
                  Join Circle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AvailableCircles;
