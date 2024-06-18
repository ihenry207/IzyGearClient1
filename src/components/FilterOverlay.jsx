import React, { useState, useEffect, useRef } from 'react';
import '../styles/FilterOverlay.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TuneIcon from '@mui/icons-material/Tune';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Loader } from '@googlemaps/js-api-loader';

const libraries = ["places"];
const FilterOverlay = ({ pcategory, onApplyFilter, showFilter, setShowFilter  }) => {
    //const [showFilter, setShowFilter] = useState(showFilter );
    const [expanded, setExpanded] = useState(null);
    const [isSticky, setIsSticky] = useState(false);
    const [selectedRadius, setSelectedRadius] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(pcategory);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedKind, setSelectedKind] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const autocompleteRef = useRef(null);
    const [inputElement, setInputElement] = useState(null);
    const [location, setLocation] = useState({ address: "" });
    useEffect(() => {
        const loader = new Loader({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries,
        });
    
        loader.load().then(() => {
          if (inputElement) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
              fields: ["formatted_address", "geometry"],
            });
    
            autocomplete.addListener("place_changed", () => {
              handlePlaceChanged(autocomplete.getPlace());
            });
    
            autocompleteRef.current = autocomplete;
          }
        });
      }, [inputElement]);
    
    const handleChangeLocation = (e) => {
        const { name, value } = e.target;
        setLocation({ ...location, [name]: value });
    };

    const handlePlaceChanged = (place) => {
        setLocation({ address: place.formatted_address });
    };

    useEffect(() => {
        setSelectedCategory(pcategory);
    }, [pcategory]);
      
    const handleScroll = () => {
        if (window.scrollY > 50) {
            setIsSticky(true);
        } else {
            setIsSticky(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleExpand = (section) => {
        setExpanded(expanded === section ? null : section);
    };

    const handleOptionClick = (filter, value) => {
        if (filter === 'Radius') {
            setSelectedRadius(value);
        } else if (filter === 'Category') {
            handleCategoryChange(value);
        } else if (filter === 'Brand') {
            setSelectedBrand(value);
        } else if (filter === 'Gender') {
            setSelectedGender(value);
        } else if (filter === 'Condition') {
            setSelectedCondition(value);
        } else if (filter === 'Price') {
            setSelectedPrice(value);
        } else if (filter === 'Size') {
            setSelectedSize(value);
        } else if (filter === 'Type') {
            setSelectedType(value);
        } else if (filter === 'Kind') {
            setSelectedKind(value);
        }
        else if (filter === 'Subcategory'){
            setSelectedSubcategory(value);
        }
    };
    

    const handlePriceChange = (event, newValue) => {
        setSelectedPrice(newValue);
    };
    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setSelectedBrand('');
        setSelectedSubcategory('');
        setSelectedGender('');
        setSelectedSize('');
        setSelectedType('');
        setSelectedKind('');
    };

    const handleApplyFilter = () => {
        const filters = {
          category: selectedCategory,
          brand: selectedBrand,
          gender: selectedGender,
          size: selectedSize,
          condition: selectedCondition,
          price: selectedPrice,
          type: selectedType,
          kind: selectedKind,
          subcategory: selectedSubcategory,
          location: location.address, // Adjust this based on your location state
          distance: selectedRadius, // Adjust this based on your distance state
        };
      
        console.log(filters);
        setShowFilter(false);
    
        onApplyFilter(filters);
    };
    

    //const filters = ['Radius', 'Category', 'Brand', 'Gender', , 'Size', 'Condition', 'Price'];
    const filters = ['Radius', 'Category'];
    const radiusOptions = [
        { value: '', label: 'Any' },
        { value: '0-5', label: '5 miles' },
        { value: '0-15', label: '15 miles' },
        { value: '0-30', label: '30 miles' },
        { value: '0-60', label: '60 miles' },
        { value: '60+', label: '60+ miles' },
    ];

    const categoryOptions = [
        { value: '', label: 'All' },
        { value: 'Ski', label: 'Ski' },
        { value: 'Snowboard', label: 'Snowboarding' },
        { value: 'Biking', label: 'Bike/eScooter' },
        { value: 'Camping', label: 'Camping' },
    ];

    const priceOptions = [
        { value: '', label: 'Any' },
        { value: '0-20', label: '$0 - $20' },
        { value: '20-40', label: '$20 - $40' },
        { value: '40-60', label: '$40 - $60' },
        { value: '60-80', label: '$60 - $80' },
        { value: '80-100', label: '$80 - $100' },
        { value: '100+', label: '$100+' },
    ];

    const sizeOptions = [
        { value: '', label: 'Any' },
        { value: '50-100', label: '50cm - 100cm' },
        { value: '100-120', label: '100cm - 120cm' },
        { value: '120-140', label: '120cm - 140cm' },
        { value: '140-160', label: '140cm - 160cm' },
        { value: '160-180', label: '160cm - 180cm' },
        { value: '180+', label: '180cm +' },
    ];

    const skiBrandOptions = [
        { value: '', label: 'All' },
        { value: '4FRNT', label: '4FRNT' },
        { value: 'Armada Skis', label: 'Armada Skis' },
        { value: 'Atomic', label: 'Atomic' },
        { value: 'Black Crows', label: 'Black Crows' },
        { value: 'Black Diamond Equipment', label: 'Black Diamond Equipment' },
        { value: 'Blizzard', label: 'Blizzard' },
        { value: 'Blossom', label: 'Blossom' },
        { value: 'DPS Skis', label: 'DPS Skis' },
        { value: 'Dynastar', label: 'Dynastar' },
        { value: 'Elan', label: 'Elan' },
        { value: 'Faction Skis', label: 'Faction Skis' },
        { value: 'Fischer', label: 'Fischer' },
        { value: 'Forest Skis', label: 'Forest Skis' },
        { value: 'Freyrie', label: 'Freyrie' },
        { value: 'Friztmeir Skis', label: 'Friztmeir Skis' },
        { value: 'Hart', label: 'Hart' },
        { value: 'Head', label: 'Head' },
        { value: 'Identity One / Id One', label: 'Identity One / Id One' },
        { value: 'J Skis', label: 'J Skis' },
        { value: 'K2', label: 'K2' },
        { value: 'Kneissl', label: 'Kneissl' },
        { value: 'Liberty Skis', label: 'Liberty Skis' },
        { value: 'Line Skis', label: 'Line Skis' },
        { value: 'Madshus', label: 'Madshus' },
        { value: 'Moment Skis', label: 'Moment Skis' },
        { value: 'Nordica', label: 'Nordica' },
        { value: 'Ogasaka Skis', label: 'Ogasaka Skis' },
        { value: 'Olin', label: 'Olin' },
        { value: 'Paradise Skis', label: 'Paradise Skis' },
        { value: 'Peltonen', label: 'Peltonen' },
        { value: 'Romp Skis', label: 'Romp Skis' },
        { value: 'Rønning Treski', label: 'Rønning Treski' },
        { value: 'Rossignol', label: 'Rossignol' },
        { value: 'Salomon', label: 'Salomon' },
        { value: 'Slatnar', label: 'Slatnar' },
        { value: 'Spalding Skis', label: 'Spalding Skis' },
        { value: 'Stöckli', label: 'Stöckli' },
        { value: 'Voit', label: 'Voit' },
        { value: 'Volant', label: 'Volant' },
        { value: 'Völkl', label: 'Völkl' },
        // { value: 'Other', label: 'Other' },
    ];

    const snowboardBrandOptions = [
        { value: '', label: 'All' },
        { value: 'Arbor', label: 'Arbor' },
        { value: 'Bataleon', label: 'Bataleon' },
        { value: 'Burton', label: 'Burton' },
        { value: 'CAPiTA', label: 'CAPiTA' },
        { value: 'Cardiff', label: 'Cardiff' },
        { value: 'DC', label: 'DC' },
        { value: 'GNU', label: 'GNU' },
        { value: 'Jones', label: 'Jones' },
        { value: 'K2', label: 'K2' },
        { value: 'Lib Tech', label: 'Lib Tech' },
        { value: 'Moss Snowstick', label: 'Moss Snowstick' },
        { value: 'Never Summer', label: 'Never Summer' },
        { value: 'Nidecker', label: 'Nidecker' },
        { value: 'Nitro', label: 'Nitro' },
        { value: 'Public Snowboards', label: 'Public Snowboards' },
        { value: 'Ride', label: 'Ride' },
        { value: 'Rome', label: 'Rome' },
        { value: 'Rossignol', label: 'Rossignol' },
        { value: 'Roxy', label: 'Roxy' },
        { value: 'Salomon', label: 'Salomon' },
        { value: 'Season', label: 'Season' },
        { value: 'Sims', label: 'Sims' },
        { value: 'Slash', label: 'Slash' },
        { value: 'United Shapes', label: 'United Shapes' },
        { value: 'Weston', label: 'Weston' },
        { value: 'WNDR Alpine', label: 'WNDR Alpine' },
        { value: 'Yes.', label: 'Yes.' },
        // { value: 'Other', label: 'Other' },
    ];

    const genderOptions = [
        { value: '', label: 'All' },
        { value: 'Men\'s', label: 'Men\'s' },
        { value: 'Women\'s', label: 'Women\'s' },
        { value: 'Kids\'', label: 'Kids\'' },
        { value: 'Boys\'', label: 'Boys\'' },
        { value: 'Girls\'', label: 'Girls\'' },
    ];

    const conditionOptions = [
        { value: '', label: 'All' },
        { value: 'Looks like new', label: 'Looks like new' },
        { value: 'Very good', label: 'Very good' },
        { value: 'Good', label: 'Good' },
        { value: 'Fair', label: 'Fair' },
    ];

    const BikeOptions = ['Type', 'Kind', 'Price', 'Gender'];

    const TypeOptions = [
    { value: '', label: 'All' },
    { value: 'Scooter', label: 'Scooter' },
    { value: 'Biking', label: 'Bike' }
    ];

    const KindOptions = [
    { value: '', label: 'All' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Non-electric', label: 'Non-electric' }
    ];

    const BikeGenderOptions = [
    { value: '', label: 'All' },
    { value: "Men's", label: "Men's" },
    { value: "Women's", label: "Women's" },
    { value: "Kids'", label: "Kids'" },
    { value: "Boys'", label: "Boys'" },
    { value: "Girls'", label: "Girls'" }
    ];

    const SubcategoryOptions = [
        {value: '', label: 'All'},
        {value: 'Sleeping bags and pads', label: 'Sleeping bags and pads'},
        {value: 'Tents and shelter', label: 'Tents and shelter'},
        {value: 'Kitchen', label: 'Kitchen'},
        {value: 'Lighting', label: 'Lighting'},
        {value: 'Furniture', label: 'Furniture'},
        {value: 'Bags and backpacks', label: 'Bags and backpacks'},
        {value: 'Outdoor clothing', label: 'Outdoor clothing'},
        {value: 'Portable power', label: 'Portable power'},
    ]

    const CampingGenderOptions = [
        { value: '', label: 'All' },
        { value: 'Men\'s', label: 'Men\'s' },
        { value: 'Women\'s', label: 'Women\'s' },
        { value: 'Kids\'', label: 'Kids\'' },
        { value: 'Boys\'', label: 'Boys\'' },
        { value: 'Girls\'', label: 'Girls\'' },
        { value: 'No gender', label: 'No gender' },
    ]


    const getBrandOptions = () => {
        
        if (selectedCategory === 'Ski') {
            return skiBrandOptions;
        } else if (selectedCategory === 'Snowboard') {
            return snowboardBrandOptions;
        }
        return [];
    };

    const getSelectedLabel = (filter) => {
        switch (filter) {
          case 'Radius':
            const radiusLabel = radiusOptions.find(option => option.value === selectedRadius)?.label;
            return radiusLabel === 'All' || radiusLabel === 'Any' ? '' : radiusLabel || '';
          case 'Category':
            const categoryLabel = categoryOptions.find(option => option.value === selectedCategory)?.label;
            return categoryLabel === 'All' || categoryLabel === 'Any' ? '' : categoryLabel || '';
          case 'Brand':
            const brandLabel = getBrandOptions().find(option => option.value === selectedBrand)?.label;
            return brandLabel === 'All' || brandLabel === 'Any' ? '' : brandLabel || '';
          case 'Gender':
            let genderLabel;
            if (selectedCategory === 'Camping') {
              genderLabel = CampingGenderOptions.find(option => option.value === selectedGender)?.label;
            } else {
              genderLabel = genderOptions.find(option => option.value === selectedGender)?.label;
            }
            return genderLabel === 'All' || genderLabel === 'Any'  ? '' : genderLabel || '';
          case 'Condition':
            const conditionLabel = conditionOptions.find(option => option.value === selectedCondition)?.label;
            return conditionLabel === 'All' || conditionLabel === 'Any' ? '' : conditionLabel || '';
          case 'Price':
            const priceLabel = priceOptions.find(option => option.value === selectedPrice)?.label;
            return priceLabel === 'All' || priceLabel === 'Any' ? '' : priceLabel || '';
          case 'Size':
            const sizeLabel = sizeOptions.find(option => option.value === selectedSize)?.label;
            return sizeLabel === 'All' || sizeLabel === 'Any' ? '' : sizeLabel || '';
          case 'Type':
            const typeLabel = TypeOptions.find(option => option.value === selectedType)?.label;
            return typeLabel === 'All' || typeLabel === 'Any' ? '' : typeLabel || '';
          case 'Kind':
            const kindLabel = KindOptions.find(option => option.value === selectedKind)?.label;
            return kindLabel === 'All' || kindLabel === 'Any' ? '' : kindLabel || '';
          case 'Subcategory':
            const subcategoryLabel = SubcategoryOptions.find(option => option.value === selectedSubcategory)?.label;
            return subcategoryLabel === 'All' || subcategoryLabel === 'Any' ? '' : subcategoryLabel || '';
          default:
            return '';
        }
      };

    const renderBrandOptions = () => {
        if (selectedCategory === 'Ski') {
          return (
            <>
              {skiBrandOptions.map((option) => (
                <div
                  key={option.value}
                  className={`filter-box ${selectedBrand === option.value ? 'selected' : ''}`}
                  onClick={() => handleOptionClick('Brand', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </>
          );
        } else if (selectedCategory === 'Snowboard') {
          return (
            <>
              {snowboardBrandOptions.map((option) => (
                <div
                  key={option.value}
                  className={`filter-box ${selectedBrand === option.value ? 'selected' : ''}`}
                  onClick={() => handleOptionClick('Brand', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </>
          );
        }
        return null;
      };

      const renderFilterOptions = () => {
        if (selectedCategory === 'Ski' || selectedCategory === 'Snowboard') {
          return (
            <>
              {/* Render filter options/dropdowns for ski or snowboard */}
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Brand')}>
                  Brand
                  {getSelectedLabel('Brand') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Brand')}
                    </span>
                  )}
                  {expanded === 'Brand' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Brand' && <div className="filter-options">{renderBrandOptions()}</div>}
              </div>
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Gender')}>
                  Gender
                  {getSelectedLabel('Gender') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Gender')}
                    </span>
                  )}
                  {expanded === 'Gender' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Gender' && (
                  <div className="filter-options">
                    {genderOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`filter-box ${selectedGender === option.value ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('Gender', option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Size')}>
                  Size
                  {getSelectedLabel('Size') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Size')}
                    </span>
                  )}
                  {expanded === 'Size' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Size' && (
                  <div className="filter-options">
                    <RadioGroup value={selectedSize} onChange={handleSizeChange}>
                      {sizeOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Condition')}>
                  Condition
                  {getSelectedLabel('Condition') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Condition')}
                    </span>
                  )}
                  {expanded === 'Condition' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Condition' && (
                  <div className="filter-options">
                    {conditionOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`filter-box ${selectedCondition === option.value ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('Condition', option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Price')}>
                  Price
                  {getSelectedLabel('Price') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Price')}
                    </span>
                  )}
                  {expanded === 'Price' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Price' && (
                  <div className="filter-options">
                    <RadioGroup value={selectedPrice} onChange={handlePriceChange}>
                      {priceOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>
            </>
          );
        } else if (selectedCategory === 'Biking') {
          return (
            <>
              {/* Render filter options/dropdowns for Biking */}
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Type')}>
                  Type
                  {getSelectedLabel('Type') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Type')}
                    </span>
                  )}
                  {expanded === 'Type' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Type' && (
                  <div className="filter-options">
                    {TypeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`filter-box ${selectedType === option.value ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('Type', option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Kind')}>
                  Kind
                  {getSelectedLabel('Kind') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Kind')}
                    </span>
                  )}
                  {expanded === 'Kind' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Kind' && (
                  <div className="filter-options">
                    {KindOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`filter-box ${selectedKind === option.value ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('Kind', option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Gender')}>
                  Gender
                  {getSelectedLabel('Gender') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Gender')}
                    </span>
                  )}
                  {expanded === 'Gender' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Gender' && (
                  <div className="filter-options">
                    {BikeGenderOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`filter-box ${selectedGender === option.value ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('Gender', option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Condition')}>
                  Condition
                  {getSelectedLabel('Condition') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Condition')}
                    </span>
                  )}
                  {expanded === 'Condition' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Condition' && (
                  <div className="filter-options">
                    {conditionOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`filter-box ${selectedCondition === option.value ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('Condition', option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Price')}>
                  Price
                  {getSelectedLabel('Price') && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {getSelectedLabel('Price')}
                    </span>
                  )}
                  {expanded === 'Price' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Price' && (
                  <div className="filter-options">
                    <RadioGroup value={selectedPrice} onChange={handlePriceChange}>
                      {priceOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>
            </>
          );
        }

        else if (selectedCategory === 'Camping') {
            return (
              <>
                {/* Render filter options/dropdowns for Camping */}
                <div className="filter-section">
                  <div className="filter-title" onClick={() => toggleExpand('Subcategory')}>
                    Subcategory
                    {getSelectedLabel('Subcategory') && (
                      <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                        {getSelectedLabel('Subcategory')}
                      </span>
                    )}
                    {expanded === 'Subcategory' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </div>
                  {expanded === 'Subcategory' && (
                    <div className="filter-options">
                      {SubcategoryOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`filter-box ${selectedSubcategory === option.value ? 'selected' : ''}`}
                          onClick={() => handleOptionClick('Subcategory', option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <div className="filter-title" onClick={() => toggleExpand('Gender')}>
                    Gender
                    {getSelectedLabel('Gender') && (
                      <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                        {getSelectedLabel('Gender')}
                      </span>
                    )}
                    {expanded === 'Gender' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </div>
                  {expanded === 'Gender' && (
                    <div className="filter-options">
                      {CampingGenderOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`filter-box ${selectedGender === option.value ? 'selected' : ''}`}
                          onClick={() => handleOptionClick('Gender', option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <div className="filter-title" onClick={() => toggleExpand('Condition')}>
                    Condition
                    {getSelectedLabel('Condition') && (
                      <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                        {getSelectedLabel('Condition')}
                      </span>
                    )}
                    {expanded === 'Condition' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </div>
                  {expanded === 'Condition' && (
                    <div className="filter-options">
                      {conditionOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`filter-box ${selectedCondition === option.value ? 'selected' : ''}`}
                          onClick={() => handleOptionClick('Condition', option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <div className="filter-title" onClick={() => toggleExpand('Price')}>
                    Price
                    {getSelectedLabel('Price') && (
                      <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                        {getSelectedLabel('Price')}
                      </span>
                    )}
                    {expanded === 'Price' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </div>
                  {expanded === 'Price' && (
                    <div className="filter-options">
                      <RadioGroup value={selectedPrice} onChange={handlePriceChange}>
                        {priceOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                          />
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </>
            );
        }
        return null;
      };
    
    
    return (
        <div className={`filter-overlay ${showFilter ? 'show' : ''}`}>
            <div className="filter-header">
                <button className="filter-button" onClick={() => setShowFilter(!showFilter)}>
                    <TuneIcon />
                    {showFilter ? 'Hide Filters' : 'Filters'}
                </button>
            </div>
            {showFilter && (
                <div className="filter-content">
                <div className="filter-section">
                    <div className="location-filter">
                        <span className="location-label">Where:</span>
                        <input
                            type="text"
                            placeholder="Enter Location"
                            className="location-input"
                            name="address"
                            value={location.address}
                            onChange={handleChangeLocation}
                            ref={setInputElement}
                        />
                    </div>

                </div>
                {filters.map((filter, index) => (
                    <div key={index} className="filter-section">
                    <div className="filter-title" onClick={() => toggleExpand(index)}>
                        {filter}
                        {getSelectedLabel(filter) && (
                        <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                            {getSelectedLabel(filter)}
                        </span>
                        )}
                        {expanded === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </div>
                    {expanded === index && (
                        <div className="filter-options">
                        {filter === 'Radius' &&
                            radiusOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`filter-box ${selectedRadius === option.value ? 'selected' : ''}`}
                                onClick={() => handleOptionClick('Radius', option.value)}
                            >
                                {option.label}
                            </div>
                            ))}
                        {filter === 'Category' &&
                            categoryOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`filter-box ${selectedCategory === option.value ? 'selected' : ''}`}
                                onClick={() => handleOptionClick('Category', option.value)}
                            >
                                {option.label}
                            </div>
                            ))}
                        </div>
                    )}
                    </div>
                ))}
                {selectedCategory && renderFilterOptions()}
                <button className="results-button" 
                onClick={handleApplyFilter}
                >Apply Filter</button>
                </div>
            )}
        </div>
    );
};

export default FilterOverlay;