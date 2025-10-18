import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getMyOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Process': return '#ff9800';
      case 'Shipped': return '#2196f3';
      case 'Delivered': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>No orders yet</h2>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h1>Order History</h1>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.slice(-8)}</h3>
                <p>{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                {order.status}
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="shipping-address">
                <h4>Shipping Address:</h4>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
              <div className="order-total">
                <h3>Total: ₹{order.totalAmount}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
