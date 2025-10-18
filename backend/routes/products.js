const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Search and filter products
router.get('/search', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;
    let query = { isActive: true };

    if (q) {
      query.$text = { $search: q };
    }
    if (category) {
      query.categoryId = parseInt(category);
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let products = Product.find(query);

    if (sort === 'price-asc') products = products.sort({ price: 1 });
    else if (sort === 'price-desc') products = products.sort({ price: -1 });
    else if (sort === 'rating') products = products.sort({ rating: -1 });

    const result = await products.exec();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products' });
  }
});

module.exports = router;
