import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { getProducts, getCategories } from '../services/api';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, sortBy, selectedCategory, products]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === parseInt(selectedCategory));
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="home-container">
      <h1 className="page-title">Welcome to E-Shop</h1>
      
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="category-filter">
        <button
          onClick={() => setSelectedCategory('')}
          className={selectedCategory === '' ? 'active' : ''}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id.toString())}
            className={selectedCategory === category.id.toString() ? 'active' : ''}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>
    </div>
  );
};

export default Home;
