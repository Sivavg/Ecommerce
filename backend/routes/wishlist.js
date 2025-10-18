const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get wishlist
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('💖 Getting wishlist for user:', req.user.userId);
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ Wishlist items:', user.wishlist);
    res.json(user.wishlist || []);
  } catch (error) {
    console.error('❌ Get wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to wishlist
router.post('/add', authMiddleware, async (req, res) => {
  try {
    console.log('➕ Adding to wishlist:', req.body);
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const parsedProductId = parseInt(productId);

    // Check if item already exists in wishlist
    const exists = user.wishlist.some(item => item.productId === parsedProductId);
    
    if (!exists) {
      user.wishlist.push({ 
        productId: parsedProductId,
        addedAt: new Date()
      });
      await user.save();
      console.log('✅ Added to wishlist');
    } else {
      console.log('⚠️ Item already in wishlist');
    }

    res.json(user.wishlist);
  } catch (error) {
    console.error('❌ Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from wishlist
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    console.log('🗑️ Removing from wishlist:', req.params.productId);
    const productId = parseInt(req.params.productId);
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter(item => item.productId !== productId);
    
    if (user.wishlist.length === initialLength) {
      console.log('⚠️ Item not found in wishlist');
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }
    
    await user.save();
    console.log('✅ Item removed from wishlist');
    res.json(user.wishlist);
  } catch (error) {
    console.error('❌ Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear wishlist
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    console.log('🧹 Clearing wishlist for user:', req.user.userId);
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.wishlist = [];
    await user.save();
    console.log('✅ Wishlist cleared');
    res.json({ message: 'Wishlist cleared', wishlist: [] });
  } catch (error) {
    console.error('❌ Clear wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
