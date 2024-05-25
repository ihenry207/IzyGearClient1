// filter.jsx
import React, { useState, useEffect } from 'react';
import '../styles/filter.css';
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const Filter = ({ pcategory, onApplyFilter, onApplyFilterAndClose }) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(pcategory);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [otherBrand, setOtherBrand] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedKind, setSelectedKind] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [otherSubcategory, setOtherSubcategory] = useState('');
  const [location, setLocation] = useState({ address: "" });
  const [distance, setDistance] = useState('');

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setLocation({ ...location, [name]: value });
  };

  const handlePlaceChanged = (place) => {
    setLocation({ address: place.formatted_address });
  };

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  useEffect(() => {
      setSelectedCategory(pcategory);
    }, [pcategory]);
  const handleCategoryChange = (e) => {
      setSelectedCategory(e.target.value);
      setSelectedBrand(''); // Reset brand when category changes
      setOtherBrand(''); // Reset otherBrand when category changes
      setSelectedSubcategory(''); // Reset subcategory when category changes
      setOtherSubcategory(''); // Reset otherSubcategory when category changes
      setSelectedGender('');
      setSelectedSize('');
      setSelectedType('')
  };
    const handleSubcategoryChange = (e) => {
      setSelectedSubcategory(e.target.value);
      if (e.target.value !== 'Others') {
        setOtherSubcategory(''); // Clear otherSubcategory if not selecting "Others"
      }
    };
    const handleOtherSubcategoryChange = (e) => {
      setOtherSubcategory(e.target.value);
    };
    
    

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
      if (e.target.value !== 'other') {
        setOtherBrand(''); // Clear otherBrand if not selecting "Other"
      }
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


  const handleApplyFilter = () => {
      const brandToApply = selectedBrand === 'other' ? otherBrand : selectedBrand;
  const subcategoryToApply = selectedSubcategory === 'Others' ? otherSubcategory : selectedSubcategory;

    const filters = {
      //we will also add location
      category: selectedCategory,
      brand: brandToApply,
      gender: selectedGender,
      size: selectedSize,
      condition: selectedCondition,
      price: selectedPrice,
      type: selectedType,
      kind: selectedKind,
      subcategory: subcategoryToApply,
      location: location.address,//this might need changing I don't know
      distance: distance,
     
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
          <option value="4FRNT">4FRNT</option>
                <option value="Armada Skis">Armada Skis</option>
                <option value="Atomic">Atomic</option>
                <option value="Black Crows">Black Crows</option>
                <option value="Black Diamond Equipment">Black Diamond Equipment</option>
                <option value="Blizzard">Blizzard</option>
                <option value="Blossom">Blossom</option>
                <option value="DPS Skis">DPS Skis</option>
                <option value="Dynastar">Dynastar</option>
                <option value="Elan">Elan</option>
                <option value="Faction Skis">Faction Skis</option>
                <option value="Fischer">Fischer</option>
                <option value="Forest Skis">Forest Skis</option>
                <option value="Freyrie">Freyrie</option>
                <option value="Friztmeir Skis">Friztmeir Skis</option>
                <option value="Hart">Hart</option>
                <option value="Head">Head</option>
                <option value="Identity One / Id One">Identity One / Id One</option>
                <option value="J Skis">J Skis</option>
                <option value="K2">K2</option>
                <option value="Kneissl">Kneissl</option>
                <option value="Liberty Skis">Liberty Skis</option>
                <option value="Line Skis">Line Skis</option>
                <option value="Madshus">Madshus</option>
                <option value="Moment Skis">Moment Skis</option>
                <option value="Nordica">Nordica</option>
                <option value="Ogasaka Skis">Ogasaka Skis</option>
                <option value="Olin">Olin</option>
                <option value="Paradise Skis">Paradise Skis</option>
                <option value="Peltonen">Peltonen</option>
                <option value="Romp Skis">Romp Skis</option>
                <option value="Rønning Treski">Rønning Treski</option>
                <option value="Rossignol">Rossignol</option>
                <option value="Salomon">Salomon</option>
                <option value="Slatnar">Slatnar</option>
                <option value="Spalding Skis">Spalding Skis</option>
                <option value="Stöckli">Stöckli</option>
                <option value="Voit">Voit</option>
                <option value="Volant">Volant</option>
                <option value="Völkl">Völkl</option>
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
                <option value="Moss Snowstick">Moss Snowstick</option>
                <option value="Never Summer">Never Summer</option>
                <option value="Nidecker">Nidecker</option>
                <option value="Nitro">Nitro</option>
                <option value="Public Snowboards">Public Snowboards</option>
                <option value="Ride">Ride</option>
                <option value="Rome">Rome</option>
                <option value="Rossignol">Rossignol</option>
                <option value="Roxy">Roxy</option>
                <option value="Salomon">Salomon</option>
                <option value="Season">Season</option>
                <option value="Sims">Sims</option>
                <option value="Slash">Slash</option>
                <option value="United Shapes">United Shapes</option>
                <option value="Weston">Weston</option>
                <option value="WNDR Alpine">WNDR Alpine</option>
                <option value="Yes.">Yes.</option>
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
              <input         
                type="text"
                placeholder="Enter brand"
                value={otherBrand}
                onChange={(e) => setOtherBrand(e.target.value)}
                />
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
    } else if (selectedCategory === 'Biking') {
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
    } else if (selectedCategory === 'Camping') {
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
                onChange={handleOtherSubcategoryChange}
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
                <LoadScript
                  googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                >
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocomplete.setFields(["formatted_address"]);
                      autocomplete.addListener("place_changed", () => {
                        handlePlaceChanged(autocomplete.getPlace());
                      });
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Enter Location"
                      style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
                      name="address"
                      value={location.address}
                      onChange={handleChangeLocation}
                      required
                    />
                  </Autocomplete>
                </LoadScript>
              </div>
              <div>
                <label htmlFor="distance">Distance from Location:</label>
                <select id="distance" value={distance} onChange={handleDistanceChange}>
                  <option value="">Any</option>
                  <option value="0-5">0 - 5 miles</option>
                  <option value="0-15">5 - 15 miles</option>
                  <option value="0-30">15 - 30 miles</option>
                  <option value="0-60">30 - 60 miles</option>
                  <option value="60+">60+ miles</option>
                </select>
              </div>
              <div>
                <label htmlFor="category">Category:</label>
                <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="">All</option>
                  <option value="Ski">Ski</option>
                  <option value="Snowboard">Snowboarding</option>
                  <option value="Biking">Bike/eScooter</option>
                  <option value="Camping">Camping</option>
                </select>
              </div>
              {selectedCategory && renderFilterOptions()}
              <button className="apply-filters-button" onClick={handleApplyFilterAndClose}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="filter-sidebar">
          <h2>Filters</h2>
          <div>
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              libraries={libraries}
            >
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(["formatted_address"]);
                  autocomplete.addListener("place_changed", () => {
                    handlePlaceChanged(autocomplete.getPlace());
                  });
                }}
              >
                <input
                  type="text"
                  placeholder="Enter Location"
                  style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                  name="address"
                  value={location.address}
                  onChange={handleChangeLocation}
                  required
                />
              </Autocomplete>
            </LoadScript>
          </div>
          <div>
            <label htmlFor="distance">Distance from Location:</label>
            <select id="distance" value={distance} onChange={handleDistanceChange}>
              <option value="">Any</option>
              <option value="0-5">0 - 5 miles</option>
              <option value="0-15">5 - 15 miles</option>
              <option value="0-30">15 - 30 miles</option>
              <option value="0-60">30 - 60 miles</option>
              <option value="60+">60+ miles</option>
            </select>
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All</option>
              <option value="Ski">Ski</option>
              <option value="Snowboard">Snowboarding</option>
              <option value="Biking">Bike/eScooter</option>
              <option value="Camping">Camping</option>
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