import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function KYCPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || localStorage.getItem('role');
  const [kycStatus, setKycStatus] = useState('verifying'); // 'verifying' | 'completed'

  useEffect(() => {
    const verifyTimer = setTimeout(() => {
      setKycStatus('completed');
    }, 2000);

    const redirectTimer = setTimeout(() => {
      if (role === 'founder') {
        navigate('/founders-registration');
      } else {
        navigate('/sharks-registration');
      }
    }, 4000);

    return () => {
      clearTimeout(verifyTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, role]);

  return (
    <div className="form-container slide-in right-form">
      {kycStatus === 'verifying' ? (
        <h2>Verifying your details and KYC under process...</h2>
      ) : (
        <h2>KYC completed successfully✅</h2>
      )}
    </div>
  );
}

export default KYCPage;
