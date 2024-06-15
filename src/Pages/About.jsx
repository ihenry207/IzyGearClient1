import React, { useState } from 'react';
import FilterOverlay from '../components/FilterOverlay'
import Navbar from "../components/Navbar";
import "../styles/About.css"
const About = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleOpenFilter = () => {
        setIsFilterOpen(true);
    };

    const handleCloseFilter = () => {
        setIsFilterOpen(false);
    };
  return (
    
    <div>
      <button onClick={handleOpenFilter}>Open Filters</button>
      <FilterOverlay isOpen={isFilterOpen} onClose={handleCloseFilter} />
    </div>
  
    
  )
}

export default About
