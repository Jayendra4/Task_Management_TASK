import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/tasks">
            <span className="logo-icon">�</span>
            <span className="logo-text">Task Manager</span>
          </Link>
        </div>
        <div className="navbar-links">
          {token ? (
            <>
              <Link to="/tasks" className="nav-link">
                <span className="nav-icon">🏠</span>
                <span>Dashboard</span>
              </Link>
              {user && (
                <div className="user-info">
                  <div className="user-avatar">
                    <span className="avatar-icon">👤</span>
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user.name || 'User'}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
              )}
              <div className="logout-container">
                <button className="logout-btn" onClick={handleLogout}>
                  <span className="btn-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="auth-links">
                <Link to="/login" className="nav-link auth-login-link">
                  <span className="nav-icon">🔐</span>
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="nav-link auth-signup-link">
                  <span className="nav-icon">✨</span>
                  <span>Sign Up</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 