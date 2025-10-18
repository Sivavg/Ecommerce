const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('📥 Getting cart for user:', req.user.userId);
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ Cart items:', user.cart);
    res.json(user.cart || []);
  } catch (error) {
    console.error('❌ Get cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    console.log('➕ Adding to cart:', req.body);
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const parsedProductId = parseInt(productId);

    // Find existing item properly
    const existingItemIndex = user.cart.findIndex(
      item => item.productId === parsedProductId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      user.cart[existingItemIndex].quantity += quantity;
      console.log('📝 Updated existing item quantity to:', user.cart[existingItemIndex].quantity);
    } else {
      // Add new item to cart
      user.cart.push({ 
        productId: parsedProductId, 
        quantity: quantity 
      });
      console.log('✅ Added new item to cart');
    }

    await user.save();
    console.log('💾 Cart saved:', user.cart);
    res.json(user.cart);
  } catch (error) {
    console.error('❌ Add to cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update', authMiddleware, async (req, res) => {
  try {
    console.log('🔄 Updating cart item:', req.body);
    const { productId, quantity } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const parsedProductId = parseInt(productId);
    const itemIndex = user.cart.findIndex(
      item => item.productId === parsedProductId
    );
    
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;
      await user.save();
      console.log('✅ Cart item updated');
      res.json(user.cart);
    } else {
      console.log('⚠️ Item not found in cart');
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('❌ Update cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    console.log('🗑️ Removing from cart:', req.params.productId);
    const productId = parseInt(req.params.productId);
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const initialLength = user.cart.length;
    user.cart = user.cart.filter(item => item.productId !== productId);
    
    if (user.cart.length === initialLength) {
      console.log('⚠️ Item not found in cart');
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    await user.save();
    console.log('✅ Item removed from cart');
    res.json(user.cart);
  } catch (error) {
    console.error('❌ Remove from cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    console.log('🧹 Clearing cart for user:', req.user.userId);
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.cart = [];
    await user.save();
    console.log('✅ Cart cleared');
    res.json({ message: 'Cart cleared', cart: [] });
  } catch (error) {
    console.error('❌ Clear cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clean duplicate cart items
router.post('/clean', authMiddleware, async (req, res) => {
  try {
    console.log('🧹 Cleaning duplicate cart items for user:', req.user.userId);
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove duplicates and sum quantities
    const productMap = new Map();
    
    user.cart.forEach(item => {
      const pid = parseInt(item.productId);
      if (productMap.has(pid)) {
        // Add to existing quantity
        const existingItem = productMap.get(pid);
        existingItem.quantity += item.quantity;
      } else {
        // Add new entry
        productMap.set(pid, {
          productId: pid,
          quantity: item.quantity
        });
      }
    });
    
    // Convert map to array
    const cleanCart = [];
    productMap.forEach(item => cleanCart.push(item));
    
    user.cart = cleanCart;
    await user.save();
    
    console.log('✅ Cart cleaned:', user.cart);
    res.json(user.cart);
  } catch (error) {
    console.error('❌ Clean cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
