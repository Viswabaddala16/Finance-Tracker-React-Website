import React, { useEffect } from 'react';
import './style.css';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userImage from '../../Assets/user.svg';

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  function signOutFunc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success('Logout Successful');
          navigate('/');
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">Financely</p>
      {/* <p className="logo link" onClick={signOutFunc}>
            Signout
          </p> */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', height: '0.5rem', gap:"0.5rem" }}>
          <img
            src={user.photoURL ? user.photoURL : userImage} // Provide a default user image URL
            style={{ height: '1.5rem', width: '1.5rem', borderRadius: '50%' }}
            alt="User Avatar"
          />
          <p className="logo link" onClick={signOutFunc}>
            Signout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
