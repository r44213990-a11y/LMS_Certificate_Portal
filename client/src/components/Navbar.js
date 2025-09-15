import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <a href="/dashboard" className="navbar-brand">
            🏆 LMS Certification Portal
          </a>
          <div className="navbar-user">
            <div className="user-info">
              <User size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              {user?.name || user?.email}
            </div>
            <button onClick={logout} className="logout-btn">
              <LogOut size={16} style={{ marginRight: '5px' }} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
