// categoryPage.jsx
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Listings from '../components/Listings';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Filter from '../components/filter';
import '../styles/categoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    brand: '',
    gender: '',
    size: '',
    condition: '',
    price: '',
  });

  const handleApplyFilter = (filters) => {
    // Apply the selected filters to the listings
    console.log(filters);
    setSelectedFilters(filters);
    //after this we call the backend and show these on the Listing instead. 
    //let's say if filter is null we call the normal api to call for all the listings
    //else we call the filtering api
  };

  const handleApplyFilterAndClose = () => {
    // Close the mobile filter overlay
    document.querySelector('.mobile-filter-overlay').style.display = 'none';
  };
  const memoizedSelectedFilters = useMemo(() => selectedFilters, [selectedFilters]);

  return (
    <div className="category-page">
      <Navbar />
      <div className="category-content">
        <Filter category={category} onApplyFilter={handleApplyFilter} onApplyFilterAndClose={handleApplyFilterAndClose} />
        
        <div className="listings-container">
          {/* <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Gear Listings</h1> */}
          <Listings category={category} selectedFilters={memoizedSelectedFilters}/>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
