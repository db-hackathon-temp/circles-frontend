import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function KYCPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state?.role || localStorage.getItem('role'))?.toLowerCase();

  const [kycStatus, setKycStatus] = useState('verifying');
  const [hasRedirected, setHasRedirected] = useState(false); // ✅ prevent loop

  useEffect(() => {
    const verifyTimer = setTimeout(() => {
      setKycStatus('completed');
    }, 2000);

    const redirectTimer = setTimeout(() => {
      if (!hasRedirected) {
        setHasRedirected(true); // ✅ prevent future redirects
        console.log('Redirecting based on role:', role);

        if (role === 'founder') {
          navigate('/founders-registration');
        } else if (role === 'shark') {
          navigate('/sharks-registration');
        } else {
          navigate('/dashboard');
        }
      }
    }, 4000);

    return () => {
      clearTimeout(verifyTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, role, hasRedirected]); // ✅ include hasRedirected in deps

  return (
    <div className="form-container slide-in right-form">
      {kycStatus === 'verifying' ? (
        <h2>Verifying your details and KYC under process...</h2>
      ) : (
        <h2>KYC completed successfully ✅</h2>
      )}
    </div>
  );
}

export default KYCPage;
