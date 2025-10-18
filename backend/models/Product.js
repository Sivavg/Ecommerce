const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  categoryId: {
    type: Number,
    required: [true, 'Category is required'],
  },
  categoryName: {
    type: String,
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
  },
  images: [{
    type: String,
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: [{
    userId: String,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  brand: {
    type: String,
  },
  specifications: {
    type: Map,
    of: String,
  },
  tags: [{
    type: String,
  }],
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  return this.stock > 0 && this.isActive;
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ categoryId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

// Method to check if product is in stock
productSchema.methods.checkStock = function(quantity) {
  return this.stock >= quantity;
};

// Method to reduce stock after purchase
productSchema.methods.reduceStock = function(quantity) {
  if (this.checkStock(quantity)) {
    this.stock -= quantity;
    return true;
  }
  return false;
};

// Static method to find products by category
productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ categoryId, isActive: true });
};

// Static method to find available products
productSchema.statics.findAvailable = function() {
  return this.find({ stock: { $gt: 0 }, isActive: true });
};

// Pre-save middleware to ensure stock doesn't go negative
productSchema.pre('save', function(next) {
  if (this.stock < 0) {
    this.stock = 0;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
