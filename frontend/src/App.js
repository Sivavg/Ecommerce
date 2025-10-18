import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import OrderHistory from './pages/OrderHistory';
import AdminPanel from './pages/AdminPanel';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
              <Route path="/order-history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
            </Routes>
            <ToastContainer position="bottom-right" autoClose={3000} />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
