import React, { useState, useEffect, useRef } from 'react';
import '../styles/FilterOverlay.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TuneIcon from '@mui/icons-material/Tune';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Loader } from '@googlemaps/js-api-loader';
import { DateRangePicker, DateRange } from 'react-date-range';
import { useMediaQuery } from 'react-responsive';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
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
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [pickupDate, setPickupDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [equipment, setEquipment] = useState("");
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

    const [dateRange, setDateRange] = useState([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: 'selection'
      }
    ]);

    const handleDateRangeChange = (item) => {
      setDateRange([item.selection]);
      setPickupDate(item.selection.startDate.toISOString());
      setReturnDate(item.selection.endDate.toISOString());
    };

    // get today's date
    const today = new Date();


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
        else if(filter == 'equipment'){
          setEquipment(value);
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
        location: location.address,
        distance: selectedRadius,
        startDate: pickupDate,
        endDate: returnDate,
        equipment: equipment
      };
    
      console.log(filters);
      setShowFilter(false);
    
      onApplyFilter(filters);
    };
    

    //const filters = ['Radius', 'Category', 'Brand', 'Gender', , 'Size', 'Condition', 'Price'];
    const filters = ['Radius', 'Category'];//we'll add date
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
        { value: 'Biking', label: 'Bikes' },
        { value: 'Camping', label: 'Camping' },
        {value: 'Water', label: 'Water'},
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

    const waterEquipment = [
      "Surfboard", "Kayak", "Paddleboard", "Jet Ski", "Water Skis", "Wakeboard", "Canoe", "Fishing Rod"
    ];

    const waterSizes = {
      "Surfboard": ["5'", "6'", "7'", "8'", "9'", "10'", "11'", "12'"],
      "Kayak": ["8'", "9'", "10'", "11'", "12'", "13'", "14'", "15'", "16'"],
      "Paddleboard": ["9'", "10'", "11'", "12'", "13'", "14'"],
      "Jet Ski": ["8'", "9'", "10'", "11'", "12'"],
      "Wakeboard": ["128cm", "132cm", "136cm", "140cm", "144cm", "146cm"],
      "Water Skis": ["60cm", "62cm", "64cm", "66cm", "68cm", "70cm"],
      "Canoe": ["12'", "13'", "14'", "15'", "16'", "17'", "18'"],
      "Fishing Rod": ["6'", "7'", "8'", "9'", "10'", "11'", "12'"]
    };

    const skiBrandOptions = [
      { value: '', label: 'Select a brand' },
      { value: 'Rossignol', label: 'Rossignol' },
      { value: 'Atomic', label: 'Atomic' },
      { value: 'Salomon', label: 'Salomon' },
      { value: 'K2', label: 'K2' },
      { value: 'Volkl', label: 'Volkl' },
      { value: 'Head', label: 'Head' },
      { value: 'Fischer', label: 'Fischer' },
      { value: 'Nordica', label: 'Nordica' },
      { value: 'Blizzard', label: 'Blizzard' },
      { value: 'Dynastar', label: 'Dynastar' },
      { value: 'Elan', label: 'Elan' },
      { value: 'Line', label: 'Line' },
      { value: 'Armada', label: 'Armada' },
      { value: 'Black Crows', label: 'Black Crows' },
      { value: 'DPS', label: 'DPS' },
      { value: 'Faction', label: 'Faction' },
      { value: 'Scott', label: 'Scott' },
      { value: 'Movement', label: 'Movement' },
      { value: 'Icelantic', label: 'Icelantic' },
      { value: 'Liberty', label: 'Liberty' },
      { value: 'Black Diamond', label: 'Black Diamond' }
    ];

    const snowboardBrandOptions = [
      { value: '', label: 'Select a brand' },
      { value: 'Burton', label: 'Burton' },
      { value: 'Ride', label: 'Ride' },
      { value: 'K2', label: 'K2' },
      { value: 'Lib Tech', label: 'Lib Tech' },
      { value: 'GNU', label: 'GNU' },
      { value: 'Salomon', label: 'Salomon' },
      { value: 'Arbor', label: 'Arbor' },
      { value: 'Never Summer', label: 'Never Summer' },
      { value: 'Jones', label: 'Jones' },
      { value: 'Nitro', label: 'Nitro' },
      { value: 'Rome', label: 'Rome' },
      { value: 'Capita', label: 'Capita' },
      { value: 'Rossignol', label: 'Rossignol' },
      { value: 'Yes', label: 'Yes' },
      { value: 'Bataleon', label: 'Bataleon' },
      { value: 'Nidecker', label: 'Nidecker' },
      { value: 'Flow', label: 'Flow' },
      { value: 'DC', label: 'DC' },
      { value: 'Signal', label: 'Signal' },
      { value: 'Weston', label: 'Weston' }
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
    { value: 'Road-Bike', label: 'Road Bike' },
    { value: 'Mountain-Bike', label: 'Mountain Bike' }
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
        {value: 'Sleeping bags', label: 'Sleeping bags'},
        {value: 'Sleeping pads', label: 'Sleeping pads'},
        {value: 'Tents and shelter', label: 'Tents and shelter'},
        {value: 'Kitchen', label: 'Kitchen'},
        {value: 'Lighting', label: 'Lighting'},
        {value: 'Furniture', label: 'Furniture'},
        {value: 'Bags and backpacks', label: 'Bags and backpacks'},
        {value: 'Outdoor clothing', label: 'Outdoor clothing'},
        {value: 'Portable power', label: 'Portable power'},
        {value: 'Coolers', label: 'Coolers'},
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
    
    const roadBikeSizes = [
      {value: '', label: 'All'},
      {value: '47', label: '47'},
      {value: '50', label: '50'},
      {value: '52', label: '52'},
      {value: '54', label: '54'},
      {value: '56', label: '56'},
      {value: '58', label: '58'},
      {value: '60', label: '60'},
      {value: '62', label: '62'}
    ];
    
    const mountainBikeSizes = [
      {value: '', label: 'All'},
      {value: 'XS', label: 'XS /26" or 27.5"'},
      {value: 'S', label: 'S /27.5" or 29"'},
      {value: 'M', label: 'M /27.5" or 29"'},
      {value: 'M/L', label: 'M/L /29" or 27.5"'},
      {value: 'L', label: 'L /29" or 27.5"'},
      {value: 'XL', label: 'XL /29" or 27.5"'},
      {value: 'XXL', label: 'XXL /29" or 27.5"'}
    ];

    const SleepingBagsSizes = [
      {value: 'All', label: 'All'},
      {value: 'Regular', label: 'Regular'},
      {value: 'Long', label: 'Long'},
      {value: 'Short', label: 'Short'},
      {value: "Women's Specific", label: "Women's Specific"},
      {value: 'Kids', label: 'Kids'}
    ];
    
    const SleepingPadsSizes = [
      {value: 'All', label: 'All'},
      {value: 'Small/Short', label: 'Small/Short'},
      {value: 'Regular', label: 'Regular'},
      {value: 'Long', label: 'Long'},
      {value: 'Wide', label: 'Wide'},
      {value: 'Double', label: 'Double'}
    ];
    
    const TentsAndShelterSizes = [
      {value: 'All', label: 'All'},
      {value: '1-Person', label: '1-Person'},
      {value: '2-Person', label: '2-Person'},
      {value: '3-Person', label: '3-Person'},
      {value: '4-Person', label: '4-Person'},
      {value: 'Family/Group (5+ person)', label: 'Family/Group (5+ person)'},
      {value: 'Ultralight', label: 'Ultralight'},
      {value: 'Basecamp', label: 'Basecamp'},
      {value: '4-Season', label: '4-Season'}
    ];
    
    const KitchenSizes = [
      {value: 'All', label: 'All'},
      {value: 'Single-Burner Stoves', label: 'Single-Burner Stoves'},
      {value: 'Double-Burner Stoves', label: 'Double-Burner Stoves'},
      {value: 'Compact/Ultralight Cook Sets', label: 'Compact/Ultralight Cook Sets'},
      {value: 'Family Cook Sets', label: 'Family Cook Sets'},
      {value: 'Grills and Griddles', label: 'Grills and Griddles'},
      {value: 'Portable Ovens', label: 'Portable Ovens'},
      {value: 'Coffee Makers', label: 'Coffee Makers'},
      {value: 'Dutch Ovens and Cast Iron Cookware', label: 'Dutch Ovens and Cast Iron Cookware'}
    ];
    
    const LightingSizes = [
      {value: 'All', label: 'All'},
      {value: 'Headlamps', label: 'Headlamps'},
      {value: 'Lanterns', label: 'Lanterns'},
      {value: 'String Lights', label: 'String Lights'},
      {value: 'Flashlights', label: 'Flashlights'},
      {value: 'Solar-Powered Lights', label: 'Solar-Powered Lights'}
    ];
    
    const FurnitureSizes = [
      {value: 'All', label: 'All'},
      {value: 'Compact/Ultralight Chairs', label: 'Compact/Ultralight Chairs'},
      {value: 'Regular Chairs', label: 'Regular Chairs'},
      {value: 'Loveseat/Double Chairs', label: 'Loveseat/Double Chairs'},
      {value: 'Tables', label: 'Tables'},
      {value: 'Cots', label: 'Cots'},
      {value: 'Hammocks', label: 'Hammocks'}
    ];
    
    const BagsAndBackPacksSizes = [
      {value: 'All', label: 'All'},
      {value: 'Daypacks', label: 'Daypacks'},
      {value: 'Overnight Packs', label: 'Overnight Packs'},
      {value: 'Weekend Packs', label: 'Weekend Packs'},
      {value: 'Expedition Packs', label: 'Expedition Packs'},
      {value: 'Hydration Packs', label: 'Hydration Packs'},
      {value: 'Waist Packs/Fanny Packs', label: 'Waist Packs/Fanny Packs'}
    ];
    
    const OutdoorClothingSizes = [
      {value: 'All', label: 'All'},
      {value: 'Jackets and Parkas', label: 'Jackets and Parkas'},
      {value: 'Pants', label: 'Pants'},
      {value: 'Base Layers', label: 'Base Layers'},
      {value: 'Insulating Layers', label: 'Insulating Layers'},
      {value: 'Footwear', label: 'Footwear'},
      {value: 'Accessories', label: 'Accessories'}
    ];
    
    const PortablePowerSizes = [
      {value: 'All', label: 'All'},
      {value: 'Power Banks', label: 'Power Banks'},
      {value: 'Solar Panels', label: 'Solar Panels'},
      {value: 'Portable Power Stations', label: 'Portable Power Stations'}
    ];
    
    const CoolersSizes = [
      {value: 'All', label: 'All'},
      {value: 'Personal/Small Coolers', label: 'Personal/Small Coolers'},
      {value: 'Medium Coolers', label: 'Medium Coolers'},
      {value: 'Large Coolers', label: 'Large Coolers'},
      {value: 'Extra Large Coolers', label: 'Extra Large Coolers'},
      {value: 'Soft Coolers', label: 'Soft Coolers'}
    ];
    const GenderSleepingBagsandOutdoorClothing = [
      {value: '', label: 'All'},
      {value: "Men's", label: "Men's"},
      {value: "Women's", label: "Women's"},
      {value: 'Unisex', label: 'Unisex'},
      {value: "Kids'", label: "Kids'"}
    ];


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

              {(selectedType === 'Road-Bike' || selectedType === 'Mountain-Bike') && (
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
                      {(selectedType === 'roadBike' ? roadBikeSizes : mountainBikeSizes).map((option) => (
                        <div
                          key={option.value}
                          className={`filter-box ${selectedSize === option.value ? 'selected' : ''}`}
                          onClick={() => handleOptionClick('Size', option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
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
                {/* Subcategory filter */}
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

                {/* Size filter */}
                {selectedSubcategory && (
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
                        {(() => {
                          switch(selectedSubcategory) {
                            case 'Sleeping bags': return SleepingBagsSizes;
                            case 'Sleeping pads': return SleepingPadsSizes;
                            case 'Tents and shelter': return TentsAndShelterSizes;
                            case 'Kitchen': return KitchenSizes;
                            case 'Lighting': return LightingSizes;
                            case 'Furniture': return FurnitureSizes;
                            case 'Bags and backpacks': return BagsAndBackPacksSizes;
                            case 'Outdoor clothing': return OutdoorClothingSizes;
                            case 'Portable power': return PortablePowerSizes;
                            case 'Coolers': return CoolersSizes;
                            default: return [];
                          }
                        })().map((option) => (
                          <div
                            key={option.value}
                            className={`filter-box ${selectedSize === option.value ? 'selected' : ''}`}
                            onClick={() => handleOptionClick('Size', option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Gender filter */}
                {(selectedSubcategory === 'Sleeping bags' || selectedSubcategory === 'Outdoor clothing') && (
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
                        {GenderSleepingBagsandOutdoorClothing.map((option) => (
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
                )}
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

        else if (selectedCategory === 'Water') {
          return (
            <>
              {/* Equipment filter */}
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Equipment')}>
                  Equipment
                  {equipment && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {equipment}
                    </span>
                  )}
                  {expanded === 'Equipment' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
                {expanded === 'Equipment' && (
                  <div className="filter-options">
                    {waterEquipment.map((option) => (
                      <div
                        key={option}
                        className={`filter-box ${equipment === option ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('equipment', option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
      
              {/* Size filter */}
              {equipment && (
                <div className="filter-section">
                  <div className="filter-title" onClick={() => toggleExpand('Size')}>
                    Size
                    {selectedSize && (
                      <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                        {selectedSize}
                      </span>
                    )}
                    {expanded === 'Size' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </div>
                  {expanded === 'Size' && (
                    <div className="filter-options">
                      {waterSizes[equipment].map((size) => (
                        <div
                          key={size}
                          className={`filter-box ${selectedSize === size ? 'selected' : ''}`}
                          onClick={() => handleOptionClick('Size', size)}
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
      
              {/* Condition filter */}
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Condition')}>
                  Condition
                  {selectedCondition && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {selectedCondition}
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
      
              {/* Price filter */}
              <div className="filter-section">
                <div className="filter-title" onClick={() => toggleExpand('Price')}>
                  Price
                  {selectedPrice && (
                    <span className="selected-label" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {selectedPrice}
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
                {/* Add DateRangePicker here */}
                <div className="filter-section">
                  <div className="filter-title" onClick={() => toggleExpand('dateRange')}>
                    Date Range
                    {expanded === 'dateRange' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </div>
                  {expanded === 'dateRange' && (
                    <div className="date-range-wrapper">
                      {isMobile ? (
                        <DateRange
                          onChange={handleDateRangeChange}
                          showSelectionPreview={true}
                          moveRangeOnFirstSelection={false}
                          months={1}
                          ranges={dateRange}
                          direction="horizontal"
                          minDate={today}
                        />
                      ) : (
                        <DateRangePicker
                          onChange={handleDateRangeChange}
                          showSelectionPreview={true}
                          moveRangeOnFirstSelection={false}
                          months={2}
                          ranges={dateRange}
                          direction="horizontal"
                          minDate={today}
                        />
                      )}
                    </div>
                  )}
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