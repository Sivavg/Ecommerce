import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addItemToCart, addItemToWishlist, isInCart, isInWishlist } = useCart();

  const handleAddToCart = async () => {
    console.log('🛒 Adding to cart:', product); // Debug log
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (product.stock === 0) {
      toast.error('Product out of stock');
      return;
    }
    
    try {
      await addItemToCart(product.id);
      console.log('✅ Added to cart successfully'); // Debug log
    } catch (error) {
      console.error('❌ Add to cart error:', error);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    if (product.stock === 0) {
      toast.error('Cannot add out of stock items to wishlist');
      return;
    }
    addItemToWishlist(product.id);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      {product.stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-rating">⭐ {product.rating}</div>
        <div className="product-price">₹{product.price}</div>
        <div className="product-stock">Stock: {product.stock}</div>
        
        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isInCart(product.id)}
            className="btn-add-cart"
          >
            {isInCart(product.id) ? '✓ In Cart' : '🛒 Add to Cart'}
          </button>
          <button
            onClick={handleAddToWishlist}
            disabled={product.stock === 0 || isInWishlist(product.id)}
            className="btn-wishlist"
          >
            {isInWishlist(product.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
