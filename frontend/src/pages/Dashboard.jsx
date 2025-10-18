import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { cart, wishlist } = useCart();

  return (
    <div className="dashboard-container">
      <h1>My Dashboard</h1>
      
      <div className="user-info">
        <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
        <div>
          <h2>{user.displayName}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link to="/wishlist" className="dashboard-card">
          <h3>❤️ Wishlist</h3>
          <p>{wishlist.length} items</p>
        </Link>

        <Link to="/cart" className="dashboard-card">
          <h3>🛒 Cart</h3>
          <p>{cart.length} items</p>
        </Link>

        <Link to="/order-history" className="dashboard-card">
          <h3>📦 Orders</h3>
          <p>View your order history</p>
        </Link>

        {user.isAdmin && (
          <Link to="/admin" className="dashboard-card admin-card">
            <h3>⚙️ Admin Panel</h3>
            <p>Manage orders</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
