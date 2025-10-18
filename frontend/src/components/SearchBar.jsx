import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
        <option value="">Sort By</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Rating</option>
        <option value="name">Name</option>
      </select>
    </div>
  );
};

export default SearchBar;
