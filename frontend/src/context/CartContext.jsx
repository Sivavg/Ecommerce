import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart, updateCartItem, removeFromCart, getWishlist, addToWishlist, removeFromWishlist } from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      console.log('🛒 Cart fetched from backend:', response.data);
      setCart(response.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    }
  };

  const addItemToCart = async (productId, quantity = 1) => {
    try {
      console.log('Adding to cart:', productId, 'quantity:', quantity);
      const response = await addToCart(productId, quantity);
      console.log('Cart updated:', response.data);
      setCart(response.data);
      toast.success('Added to cart!');
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
      throw error;
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      console.log('Updating cart item:', productId, 'new quantity:', quantity);
      const response = await updateCartItem(productId, quantity);
      console.log('Cart after update:', response.data);
      setCart(response.data);
      return response.data;
    } catch (error) {
      console.error('Update cart error:', error);
      toast.error('Failed to update cart');
      throw error;
    }
  };

  const removeItem = async (productId) => {
    try {
      console.log('Removing from cart:', productId);
      const response = await removeFromCart(productId);
      console.log('Cart after removal:', response.data);
      setCart(response.data);
      toast.success('Removed from cart');
      return response.data;
    } catch (error) {
      console.error('Remove from cart error:', error);
      toast.error('Failed to remove item');
      throw error;
    }
  };

  const addItemToWishlist = async (productId) => {
    try {
      const response = await addToWishlist(productId);
      setWishlist(response.data);
      toast.success('Added to wishlist!');
      return response.data;
    } catch (error) {
      console.error('Add to wishlist error:', error);
      toast.error('Failed to add to wishlist');
      throw error;
    }
  };

  const removeItemFromWishlist = async (productId) => {
    try {
      const response = await removeFromWishlist(productId);
      setWishlist(response.data);
      toast.success('Removed from wishlist');
      return response.data;
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error('Failed to remove from wishlist');
      throw error;
    }
  };

  const isInCart = (productId) => {
    return cart.some(item => item.productId === productId);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  const value = {
    cart,
    wishlist,
    addItemToCart,
    updateItem,
    removeItem,
    addItemToWishlist,
    removeItemFromWishlist,
    isInCart,
    isInWishlist,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
