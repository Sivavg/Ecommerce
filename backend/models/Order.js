const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [{
    productId: { type: Number, required: true },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
  },
  status: {
    type: String,
    enum: ['On Process', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'On Process',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
