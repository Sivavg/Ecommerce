import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import { toast } from 'react-toastify';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeItemFromWishlist, addItemToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🚀 Wishlist component mounted');
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log('\n=== WISHLIST MERGE PROCESS ===');
    console.log('💖 Wishlist from backend:', JSON.stringify(wishlist, null, 2));
    console.log('🛍️ Products loaded:', products.length);
    
    if (products.length === 0) {
      console.log('⚠️ No products loaded yet');
      return;
    }
    
    if (wishlist.length === 0) {
      console.log('⚠️ Wishlist is empty');
      setWishlistItems([]);
      setLoading(false);
      return;
    }
    
    console.log('🔄 Starting merge process...');
    
    const mergedItems = [];
    
    wishlist.forEach((wishItem, index) => {
      console.log(`\n--- Wishlist Item ${index + 1} ---`);
      console.log('Wishlist item:', wishItem);
      console.log('Looking for productId:', wishItem.productId, '(type:', typeof wishItem.productId, ')');
      
      // Find matching product
      const matchingProduct = products.find(product => {
        const matches = (
          product.id === wishItem.productId ||
          product.id === parseInt(wishItem.productId) ||
          parseInt(product.id) === parseInt(wishItem.productId)
        );
        
        if (matches) {
          console.log('✅ FOUND MATCH:', product.name);
        }
        
        return matches;
      });
      
      if (matchingProduct) {
        mergedItems.push(matchingProduct);
        console.log('✅ Added to merged items');
      } else {
        console.log('❌ NO MATCH FOUND');
        console.log('Available product IDs:', products.map(p => `${p.id} (${typeof p.id})`));
      }
    });
    
    console.log('\n📊 Merge Summary:');
    console.log('Input wishlist items:', wishlist.length);
    console.log('Output merged items:', mergedItems.length);
    console.log('Merged items:', mergedItems);
    
    setWishlistItems(mergedItems);
    setLoading(false);
    console.log('=== MERGE COMPLETE ===\n');
  }, [wishlist, products]);

  const fetchProducts = async () => {
    try {
      console.log('📡 Fetching products...');
      const response = await getProducts();
      console.log('✅ Products fetched:', response.data.length);
      setProducts(response.data);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      console.log('🗑️ Removing from wishlist:', productId);
      await removeItemFromWishlist(productId);
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      console.log('🛒 Moving to cart:', productId);
      await addItemToCart(productId);
      await removeItemFromWishlist(productId);
      toast.success('Moved to cart!');
    } catch (error) {
      console.error('Move to cart error:', error);
    }
  };

  if (loading) {
    return (
      <div className="empty-wishlist">
        <h2>Loading wishlist...</h2>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="empty-wishlist">
        <h2>Your wishlist is empty</h2>
        <p>Wishlist data: {wishlist.length} items in backend</p>
        <p>Products loaded: {products.length}</p>
        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px' }}>
          Debug info in browser console (Press F12)
        </p>
        <button onClick={() => navigate('/')} className="btn-continue">
          Continue Shopping
        </button>
        <button 
          onClick={fetchProducts} 
          className="btn-continue"
          style={{ marginTop: '10px', background: '#2196f3' }}
        >
          🔄 Reload Data
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1>My Wishlist ({wishlistItems.length})</h1>
      
      <div className="wishlist-grid">
        {wishlistItems.map(item => (
          <div key={item.id} className="wishlist-item">
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="item-rating">⭐ {item.rating}</div>
              <div className="item-price">₹{item.price}</div>
              <div className="item-stock">
                {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
              </div>
              <div className="item-actions">
                <button 
                  onClick={() => handleMoveToCart(item.id)} 
                  className="btn-move-cart"
                  disabled={item.stock === 0}
                >
                  {item.stock > 0 ? '🛒 Move to Cart' : 'Out of Stock'}
                </button>
                <button 
                  onClick={() => handleRemove(item.id)} 
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
