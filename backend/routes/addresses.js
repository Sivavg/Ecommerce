const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const authMiddleware = require('../middleware/auth');

// Get all addresses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.uid });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new address
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const addressData = {
      userId: req.user.uid,
      ...req.body,
    };

    const address = new Address(addressData);
    await address.save();

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update address
router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete address
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
