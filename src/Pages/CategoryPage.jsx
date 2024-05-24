import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Listings from '../components/Listings';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Filter from '../components/filter';
import '../styles/categoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  
  const getInitialFilters = () => {
    if (category === 'Biking') {
      return {
        category: category,
        type: '',
        kind: '',
        brand: '',
        gender: '',
        size: '',
        condition: '',
        price: '',
      };
    } else if (category === 'Camping') {
      return {
        category: category,
        subcategory: '',
        name: '',
        brand: '',
        gender: '',
        size: '',
        condition: '',
        price: '',
      };
    } else {
      return {
        category: category,
        brand: '',
        gender: '',
        size: '',
        condition: '',
        price: '',
      };
    }
  };

  const [selectedFilters, setSelectedFilters] = useState(getInitialFilters());

  const handleApplyFilter = (filters) => {
    console.log(filters);
    setSelectedFilters(filters);
  };

  const handleApplyFilterAndClose = () => {
    document.querySelector('.mobile-filter-overlay').style.display = 'none';
  };

  const memoizedSelectedFilters = useMemo(() => selectedFilters, [selectedFilters]);

  return (
    <div className="category-page">
      <Navbar />
      <div className="category-content">
        <Filter pcategory={category} onApplyFilter={handleApplyFilter} onApplyFilterAndClose={handleApplyFilterAndClose} />
        <div className="listings-container">
          <Listings pcategory={category} selectedFilters={memoizedSelectedFilters} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;