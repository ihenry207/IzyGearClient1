import React, { useState, useMemo, useEffect  } from 'react';
import { useParams, useLocation  } from 'react-router-dom';
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
  const location = useLocation();
  const searchData = location.state?.searchData;

  const getInitialFilters = (categoryName, searchParams) => {
    const baseFilters = {
      location: searchParams?.location || '',
      distance: searchParams?.radius || '',
      startDate: searchParams?.pickupDateTime || '',
      endDate: searchParams?.returnDateTime || '',
      category: categoryName,
      brand: '',
      gender: '',
      size: '',
      condition: '',
      price: '',
    };

    if (categoryName === 'Biking') {
      return {
        ...baseFilters,
        type: '',
        kind: '',
      };
    } else if (categoryName === 'Camping') {
      return {
        ...baseFilters,
        subcategory: '',
        name: '',
      };
    } else if (categoryName === 'Water') {
      return {
        ...baseFilters,
        equipment: '',
      };
    }
     else {
      return baseFilters;
    }
  };

  const [selectedFilters, setSelectedFilters] = useState(getInitialFilters(category, searchData));

  console.log("Here inside cat page search params: ", selectedFilters);

  const handleApplyFilter = (filters) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      ...filters
    }));
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
        <div className={`listings-container ${showFilter ? 'blurred' : ''}`}>
          <Listings pcategory={category} selectedFilters={memoizedSelectedFilters} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;