// filter.jsx
import React, { useState } from 'react';
import '../styles/filter.css';

const Filter = ({ category, onApplyFilter, onApplyFilterAndClose }) => {
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedKind, setSelectedKind] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [otherSubcategory, setOtherSubcategory] = useState('');
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedBrand('');
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleConditionChange = (e) => {
    setSelectedCondition(e.target.value);
  };

  const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
  };

  const handleMobileFilterClick = () => {
    setShowMobileFilter(true);
  };

  const handleMobileFilterClose = () => {
    setShowMobileFilter(false);
  };
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleKindChange = (e) => {
    setSelectedKind(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleApplyFilter = () => {
    const filters = {
      //we will also add location
      category: selectedCategory,
      brand: selectedBrand,
      gender: selectedGender,
      size: selectedSize,
      condition: selectedCondition,
      price: selectedPrice,
    };
    onApplyFilter(filters);
  };
  const handleApplyFilterAndClose = () => {
    handleApplyFilter();
    onApplyFilterAndClose();
  };

  const renderBrandOptions = () => {
    if (selectedCategory === 'Ski') {
      return (
        <>
          <option value="">All</option>
          <option value="Armada">Armada</option>
          <option value="Atomic">Atomic</option>
          <option value="Black Crows">Black Crows</option>
          <option value="Black Diamond">Black Diamond</option>
          <option value="Blizzard">Blizzard</option>
          <option value="Candide">Candide</option>
          <option value="Coalition Snow">Coalition Snow</option>
          <option value="DPS">DPS</option>
          <option value="Dynafit">Dynafit</option>
          <option value="Dynastar">Dynastar</option>
          <option value="other">Other</option>
        </>
      );
    } else if (selectedCategory === 'Snowboard') {
      return (
        <>
          <option value="">All</option>
          <option value="Arbor">Arbor</option>
          <option value="Bataleon">Bataleon</option>
          <option value="Burton">Burton</option>
          <option value="CAPiTA">CAPiTA</option>
          <option value="Cardiff">Cardiff</option>
          <option value="DC">DC</option>
          <option value="GNU">GNU</option>
          <option value="Jones">Jones</option>
          <option value="K2">K2</option>
          <option value="Lib Tech">Lib Tech</option>
          <option value="other">Other</option>
        </>
      );
    }
    return null;
  };
  const renderFilterOptions = () => {
    if (selectedCategory === 'Ski' || selectedCategory === 'Snowboard') {
      return (
        <>
          <div>
            <label htmlFor="brand">Brand:</label>
            <select id="brand" value={selectedBrand} onChange={handleBrandChange}>
              {renderBrandOptions()}
            </select>
            {selectedBrand === 'other' && (
              <input type="text" placeholder="Enter brand" />
            )}
          </div>
          <div>
            <label htmlFor="gender">Gender:</label>
            <select id="gender" value={selectedGender} onChange={handleGenderChange}>
              <option value="">All</option>
              <option value="Men's">Men's</option>
              <option value="Women's">Women's</option>
              <option value="Kids'">Kids'</option>
              <option value="Boys'">Boys'</option>
              <option value="Girls'">Girls'</option>
            </select>
          </div>
          <div>
            <label htmlFor="size">Size:</label>
            <select id="size" value={selectedSize} onChange={handleSizeChange}>
              <option value="">All</option>
              <option value="50-120">50cm - 120cm</option>
              <option value="120-160">120cm - 160cm</option>
              <option value="160+">160cm +</option>
            </select>
          </div>
          <div>
            <label htmlFor="condition">Condition:</label>
            <select id="condition" value={selectedCondition} onChange={handleConditionChange}>
              <option value="">All</option>
              <option value="Looks like new">Looks like new</option>
              <option value="Very good">Very good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <select id="price" value={selectedPrice} onChange={handlePriceChange}>
              <option value="">All</option>
              <option value="0-20">$0 - $20</option>
              <option value="20-40">$20 - $40</option>
              <option value="40-60">$40 - $60</option>
              <option value="60-80">$60 - $80</option>
              <option value="80-100">$80 - $100</option>
              <option value="100+">$100+</option>
            </select>
          </div>
        </>
      );
    } else if (selectedCategory === 'biking') {
      return (
        <>
          <div>
            <label htmlFor="type">Type:</label>
            <select id="type" value={selectedType} onChange={handleTypeChange}>
              <option value="">All</option>
              <option value="Scooter">Scooter</option>
              <option value="Biking">Bike</option>
            </select>
          </div>
          <div>
            <label htmlFor="kind">Kind:</label>
            <select id="kind" value={selectedKind} onChange={handleKindChange}>
              <option value="">All</option>
              <option value="Electric">Electric</option>
              <option value="Non-electric">Non-electric</option>
            </select>
          </div>
          <div>
            <label htmlFor="brand">Brand:</label>
            <input type="text" id="brand" value={selectedBrand} onChange={handleBrandChange} placeholder="Enter brand" />
          </div>
          <div>
            <label htmlFor="gender">Gender:</label>
            <select id="gender" value={selectedGender} onChange={handleGenderChange}>
              <option value="">All</option>
              <option value="Men's">Men's</option>
              <option value="Women's">Women's</option>
              <option value="Kids'">Kids'</option>
              <option value="Boys'">Boys'</option>
              <option value="Girls'">Girls'</option>
            </select>
          </div>
          <div>
            <label htmlFor="size">Size:</label>
            <input type="text" id="size" value={selectedSize} onChange={handleSizeChange} placeholder="Enter size" />
          </div>
          <div>
            <label htmlFor="condition">Condition:</label>
            <select id="condition" value={selectedCondition} onChange={handleConditionChange}>
              <option value="">All</option>
              <option value="Looks like new">Looks like new</option>
              <option value="Very good">Very good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <select id="price" value={selectedPrice} onChange={handlePriceChange}>
              <option value="">All</option>
              <option value="0-20">$0 - $20</option>
              <option value="20-40">$20 - $40</option>
              <option value="40-60">$40 - $60</option>
              <option value="60-80">$60 - $80</option>
              <option value="80-100">$80 - $100</option>
              <option value="100+">$100+</option>
            </select>
          </div>
        </>
      );
    } else if (selectedCategory === 'camping') {
      return (
        <>
          <div>
            <label htmlFor="subcategory">Subcategory:</label>
            <select id="subcategory" value={selectedSubcategory} onChange={handleSubcategoryChange}>
              <option value="">All</option>
              <option value="Sleeping bags and pads">Sleeping bags and pads</option>
              <option value="Tents and shelter">Tents and shelter</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Lighting">Lighting</option>
              <option value="Furniture">Furniture</option>
              <option value="Bags and backpacks">Bags and backpacks</option>
              <option value="Outdoor clothing">Outdoor clothing</option>
              <option value="Portable power">Portable power</option>
              <option value="Others">Others</option>
            </select>
            {selectedSubcategory === 'Others' && (
              <input
                type="text"
                placeholder="Specify subcategory"
                value={otherSubcategory}
                onChange={(e) => setOtherSubcategory(e.target.value)}
                required
              />
            )}
          </div>
          <div>
            <label htmlFor="brand">Brand:</label>
            <input type="text" id="brand" value={selectedBrand} onChange={handleBrandChange} placeholder="Enter brand" />
          </div>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" placeholder="Enter name" />
          </div>
          <div>
            <label htmlFor="gender">Gender:</label>
            <select id="gender" value={selectedGender} onChange={handleGenderChange}>
              <option value="">All</option>
              <option value="Men's">Men's</option>
              <option value="Women's">Women's</option>
              <option value="Kids'">Kids'</option>
              <option value="Boys'">Boys'</option>
              <option value="Girls'">Girls'</option>
              <option value="No gender">No gender</option>
            </select>
          </div>
          <div>
            <label htmlFor="size">Size:</label>
            <input type="text" id="size" value={selectedSize} onChange={handleSizeChange} placeholder="Enter size" />
          </div>
          <div>
            <label htmlFor="condition">Condition:</label>
            <select id="condition" value={selectedCondition} onChange={handleConditionChange}>
              <option value="">All</option>
              <option value="Looks like new">Looks like new</option>
              <option value="Very good">Very good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <select id="price" value={selectedPrice} onChange={handlePriceChange}>
              <option value="">All</option>
              <option value="0-20">$0 - $20</option>
              <option value="20-40">$20 - $40</option>
              <option value="40-60">$40 - $60</option>
              <option value="60-80">$60 - $80</option>
              <option value="80-100">$80 - $100</option>
              <option value="100+">$100+</option>
            </select>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <div className="mobile-filter-button" onClick={handleMobileFilterClick}>
        Filters
      </div>
      {showMobileFilter ? (
        <div className="mobile-filter-overlay">
          <div className="mobile-filter-container">
            <button className="close-button" onClick={handleMobileFilterClose}>
              &times;
            </button>
            <h2>Filters</h2>
            <div className="mobile-filter-content">
              <div>
                <label htmlFor="category">Category:</label>
                <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="">All</option>
                  <option value="Ski">Ski</option>
                  <option value="Snowboard">Snowboarding</option>
                  <option value="biking">Bike/eScooter</option>
                  <option value="camping">Camping</option>
                </select>
              </div>
              {selectedCategory && renderFilterOptions()}
              <button className="apply-filters-button" onClick={handleApplyFilterAndClose}>Apply Filters</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="filter-sidebar">
          <h2>Filters</h2>
          <div>
            <label htmlFor="category">Category:</label>
            <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All</option>
              <option value="Ski">Ski</option>
              <option value="Snowboard">Snowboarding</option>
              <option value="biking">Bike/eScooter</option>
              <option value="camping">Camping</option>
            </select>
          </div>
          {selectedCategory && renderFilterOptions()}
          <button onClick={handleApplyFilter}>Apply Filters</button>
        </div>
      )}
    </>
  );
};

export default Filter;