import React, { useState, useEffect } from 'react';
import '../styles/FilterOverlay.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TuneIcon from '@mui/icons-material/Tune';
import PriceInput from './PriceInput'; 
const FilterOverlay = ({ onClose }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [isSticky, setIsSticky] = useState(false);
    const [selectedRadius, setSelectedRadius] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [selectedPrice, setSelectedPrice] = useState([10, 500]);

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
            setSelectedCategory(value);
        } else if (filter === 'Brand') {
            setSelectedBrand(value);
        } else if (filter === 'Gender') {
            setSelectedGender(value);
        } else if (filter === 'Condition') {
            setSelectedCondition(value);
        }
    };

    const handlePriceChange = (event, newValue) => {
        setSelectedPrice(newValue);
    };

    const filters = ['Radius', 'Category', 'Brand', 'Gender', 'Condition', 'Price'];

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
        { value: 'Other', label: 'Other' },
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
        { value: 'Other', label: 'Other' },
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

    const getBrandOptions = () => {
        if (selectedCategory === 'Ski') {
            return skiBrandOptions;
        } else if (selectedCategory === 'Snowboard') {
            return snowboardBrandOptions;
        }
        return [];
    };

    return (
        <div className={`filter-overlay ${isSticky ? 'sticky' : ''}`}>
            <div className="filter-header">
                <button className="filter-button" onClick={() => setShowFilter(!showFilter)}>
                    <TuneIcon />
                    {showFilter ? 'Hide Filters' : 'Filters'}
                </button>
            </div>
            {showFilter && (
                <div className="filter-content">
                    <div className="filter-section">
                        <div className="filter-title">
                            <span>Where:</span>
                            <input type="text" placeholder="Enter location" className="location-input-box" />
                        </div>
                    </div>
                    {filters.map((filter, index) => (
                        <div key={index} className="filter-section">
                            <div className="filter-title" onClick={() => toggleExpand(index)}>
                                {filter}
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
                                  
                                  
                                    {filter === 'Brand' &&
                                        getBrandOptions().map((option) => (
                                            <div
                                                key={option.value}
                                                className={`filter-box ${selectedBrand === option.value ? 'selected' : ''}`}
                                                onClick={() => handleOptionClick('Brand', option.value)}
                                            > 
                                                {option.label}
                                            </div>
                                        ))}
                                    {filter === 'Gender' && (selectedCategory === 'Ski' || selectedCategory === 'Snowboard') &&
                                        genderOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`filter-box ${selectedGender === option.value ? 'selected' : ''}`}
                                                onClick={() => handleOptionClick('Gender', option.value)}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    {filter === 'Condition' && (selectedCategory === 'Ski' || selectedCategory === 'Snowboard') &&
                                        conditionOptions.map((option) => (
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
                    ))}
                    <button className="results-button">Apply Filter</button>
                </div>
            )}
        </div>
    );
};

export default FilterOverlay;
