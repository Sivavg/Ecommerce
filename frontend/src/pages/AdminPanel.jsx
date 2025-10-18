import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/api';
import { toast } from 'react-toastify';
import './AdminPanel.css';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchAllOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-container">
      <h1>Admin Panel - Order Management</h1>
      
      <div className="admin-orders">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="admin-order-card">
              <div className="order-info">
                <h3>Order #{order._id.slice(-8)}</h3>
                <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
                <p>Total: ₹{order.totalAmount}</p>
                <p>Customer: {order.shippingAddress.fullName}</p>
              </div>

              <div className="order-items-admin">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="admin-item">
                    <span>{item.name} (x{item.quantity})</span>
                  </div>
                ))}
              </div>

              <div className="order-status-control">
                <label>Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="status-select"
                >
                  <option value="On Process">On Process</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
