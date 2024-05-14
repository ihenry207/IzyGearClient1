// categoryPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Listings from '../components/Listings';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Filter from '../components/filter';
import '../styles/categoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();

  const handleApplyFilter = (filters) => {
    // Apply the selected filters to the listings
    console.log(filters);
  };

  const handleApplyFilterAndClose = () => {
    // Close the mobile filter overlay
    document.querySelector('.mobile-filter-overlay').style.display = 'none';
  };

  return (
    <div className="category-page">
      <Navbar />
      <div className="category-content">
        <Filter category={category} onApplyFilter={handleApplyFilter} onApplyFilterAndClose={handleApplyFilterAndClose} />
        
        <div className="listings-container">
          {/* <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Gear Listings</h1> */}
          <Listings category={category} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
