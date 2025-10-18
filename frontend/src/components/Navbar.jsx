import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛒 SivE-Shop
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          
          {user ? (
            <>
              <Link to="/wishlist" className="navbar-link">
                ❤️ Wishlist ({wishlist.length})
              </Link>
              <Link to="/cart" className="navbar-link">
                🛒 Cart ({cart.length})
              </Link>
              <div className="navbar-dropdown">
                <button className="navbar-account">
                  <img src={user.photoURL} alt={user.displayName} className="navbar-avatar" />
                  My Account
                </button>
                <div className="dropdown-content">
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/order-history">Orders</Link>
                  {user.isAdmin && <Link to="/admin">Admin Panel</Link>}
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="navbar-link login-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
