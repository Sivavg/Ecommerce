import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts, getAddresses, addAddress, createOrder } from '../services/api';
import AddressModal from '../components/AddressModal';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const { cart, updateItem, removeItem, fetchCart } = useCart();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🚀 Cart component mounted');
    loadData();
  }, []);

  const loadData = async () => {
    console.log('📡 Loading data...');
    await fetchProducts();
    await fetchAddresses();
    setLoading(false);
    console.log('✅ Data loading complete');
  };

  useEffect(() => {
    console.log('\n=== CART MERGE PROCESS ===');
    console.log('📦 Cart items from backend:', JSON.stringify(cart, null, 2));
    console.log('🛍️ Products from JSON server:', products.length, 'products');
    
    if (products.length === 0) {
      console.log('⚠️ No products loaded yet');
      return;
    }
    
    if (cart.length === 0) {
      console.log('⚠️ Cart is empty');
      setCartItems([]);
      return;
    }
    
    console.log('🔄 Starting merge process...');
    
    const mergedItems = [];
    
    cart.forEach((cartItem, index) => {
      console.log(`\n--- Item ${index + 1} ---`);
      console.log('Cart item:', cartItem);
      console.log('Looking for productId:', cartItem.productId, '(type:', typeof cartItem.productId, ')');
      
      // Find matching product
      const matchingProduct = products.find(product => {
        const matches = (
          product.id === cartItem.productId ||
          product.id === parseInt(cartItem.productId) ||
          parseInt(product.id) === parseInt(cartItem.productId)
        );
        
        if (matches) {
          console.log('✅ FOUND MATCH:', product.name);
        }
        
        return matches;
      });
      
      if (matchingProduct) {
        mergedItems.push({
          ...matchingProduct,
          quantity: cartItem.quantity || 1
        });
        console.log('✅ Added to merged items');
      } else {
        console.log('❌ NO MATCH FOUND');
        console.log('Available product IDs:', products.map(p => `${p.id} (${typeof p.id})`));
      }
    });
    
    console.log('\n📊 Merge Summary:');
    console.log('Input cart items:', cart.length);
    console.log('Output merged items:', mergedItems.length);
    console.log('Merged items:', mergedItems);
    
    setCartItems(mergedItems);
    console.log('=== MERGE COMPLETE ===\n');
  }, [cart, products]);

  const fetchProducts = async () => {
    try {
      console.log('📡 Fetching products from http://localhost:5001/products');
      const response = await getProducts();
      console.log('✅ Products response:', response.data);
      console.log('First product sample:', response.data[0]);
      setProducts(response.data);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const fetchAddresses = async () => {
    try {
      console.log('📍 Fetching addresses...');
      const response = await getAddresses();
      console.log('✅ Addresses:', response.data.length);
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0]._id);
      }
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateItem(productId, newQuantity);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      await addAddress(addressData);
      setShowAddressModal(false);
      await fetchAddresses();
      toast.success('Address added successfully');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    const address = addresses.find(addr => addr._id === selectedAddress);

    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: calculateTotal(),
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
    };

    try {
      await createOrder(orderData);
      toast.success('Order placed successfully!');
      await fetchCart();
      navigate('/order-history');
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="empty-cart">
        <h2>Loading cart...</h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Cart data: {cart.length} items in backend</p>
        <p>Products loaded: {products.length}</p>
        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px' }}>
          Debug info in browser console (Press F12)
        </p>
        <button onClick={() => navigate('/')} className="btn-continue">
          Continue Shopping
        </button>
        <button 
          onClick={loadData} 
          className="btn-continue"
          style={{ marginTop: '10px', background: '#2196f3' }}
        >
          🔄 Reload Data
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart ({cartItems.length})</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
              </div>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <div className="item-total">₹{item.price * item.quantity}</div>
              <button onClick={() => handleRemove(item.id)} className="btn-remove">
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{calculateTotal()}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{calculateTotal()}</span>
          </div>

          <h3>Delivery Address</h3>
          {addresses.length > 0 ? (
            <select 
              value={selectedAddress || ''} 
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="address-select"
            >
              {addresses.map(addr => (
                <option key={addr._id} value={addr._id}>
                  {addr.fullName} - {addr.city}, {addr.state}
                </option>
              ))}
            </select>
          ) : (
            <p>No addresses found</p>
          )}
          
          <button onClick={() => setShowAddressModal(true)} className="btn-add-address">
            + Add New Address
          </button>

          <button 
            onClick={handleCheckout} 
            className="btn-checkout"
            disabled={!selectedAddress}
          >
            Place Order
          </button>
        </div>
      </div>

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSubmit={handleAddAddress}
      />
    </div>
  );
};

export default Cart;
