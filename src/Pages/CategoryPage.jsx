import React, { useState, useMemo, useEffect  } from 'react';
import { useParams } from 'react-router-dom';
import Listings from '../components/Listings';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Filter from '../components/filter';
import '../styles/categoryPage.css';
import FilterOverlay from '../components/FilterOverlay'
import TuneIcon from '@mui/icons-material/Tune';
const libraries = ["places"];
const CategoryPage = () => {
  const { category } = useParams();
  const getInitialFilters = () => {
    if (category === 'Biking') {
      return {
        location:'',
        distance:'',
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
        location:'',
        distance:'',
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
        location:'',
        distance:'',
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
    //console.log(filters);
    setSelectedFilters(filters);
  };

  const handleApplyFilterAndClose = () => {
    document.querySelector('.mobile-filter-overlay').style.display = 'none';
  };

  const [showFilter, setShowFilter] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 0) {
        setHideButton(true);
      } else {
        setHideButton(false);
      }
      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const memoizedSelectedFilters = useMemo(() => selectedFilters, [selectedFilters]);

  return (
    <div className="category-page">
      
      <Navbar />
      <div className="category-content">
        <div className={`filter-button-container ${hideButton ? 'hide' : ''}`}>
          <button className="filter-button" onClick={handleFilterClick}>
            <TuneIcon />
            {showFilter ? 'Hide Filters' : 'Filters'}
          </button>
        </div>
        <FilterOverlay
          pcategory={category}
          onApplyFilter={handleApplyFilter}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />

        {/* <Filter pcategory={category} onApplyFilter={handleApplyFilter} 
        onApplyFilterAndClose={handleApplyFilterAndClose} /> */}
        
        <div className="listings-container">
          <Listings pcategory={category} selectedFilters={memoizedSelectedFilters} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;