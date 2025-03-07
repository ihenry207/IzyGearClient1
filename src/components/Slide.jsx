import React, { useEffect, useState, useRef } from 'react';
import '../styles/Slide.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/CustomDatePicker.css';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Loader } from '@googlemaps/js-api-loader';
import { useNavigate } from 'react-router-dom';
const libraries = ["places"];
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const currentDate = new Date();
  const isCurrentMonth = date.getMonth() === currentDate.getMonth() && 
                         date.getFullYear() === currentDate.getFullYear();

  return (
    <div className="react-datepicker__custom-header">
      {!isCurrentMonth && (
        <button
          className="react-datepicker__navigation react-datepicker__navigation--previous"
          onClick={(e) => {
            e.stopPropagation();
            decreaseMonth();
          }}
          disabled={prevMonthButtonDisabled}
        >
          <ArrowBackIosIcon className="react-datepicker__navigation-icon" />
        </button>
      )}
      {isCurrentMonth && <div className="react-datepicker__navigation-placeholder"></div>}
      <div className="react-datepicker__header-content">
        <span className="react-datepicker__current-month">
          {date.toLocaleString("default", { month: "long" })}
        </span>
        <span className="react-datepicker__current-year">
          {date.getFullYear()}
        </span>
      </div>
      <button
        className="react-datepicker__navigation react-datepicker__navigation--next"
        onClick={(e) => {
          e.stopPropagation();
          increaseMonth();
        }}
        disabled={nextMonthButtonDisabled}
      >
        <ArrowForwardIosIcon className="react-datepicker__navigation-icon" />
      </button>
    </div>
  );
};

const Slide = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState(tomorrow);
  const [returnDate, setReturnDate] = useState(dayAfterTomorrow);
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnTime, setReturnTime] = useState('05:00 PM');
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isPickupTimeOpen, setIsPickupTimeOpen] = useState(false);
  const [isReturnTimeOpen, setIsReturnTimeOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [inputElement, setInputElement] = useState(null);
  const autocompleteRef = useRef(null);
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

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  });

  const togglePickup = () => {
    setIsPickupOpen(!isPickupOpen);
    setIsReturnOpen(false);
    setIsPickupTimeOpen(false);
    setIsReturnTimeOpen(false);
  };

  const toggleReturn = () => {
    setIsReturnOpen(!isReturnOpen);
    setIsPickupOpen(false);
    setIsPickupTimeOpen(false);
    setIsReturnTimeOpen(false);
  };

  const togglePickupTime = () => {
    setIsPickupTimeOpen(!isPickupTimeOpen);
    setIsPickupOpen(false);
    setIsReturnOpen(false);
    setIsReturnTimeOpen(false);
  };

  const toggleReturnTime = () => {
    setIsReturnTimeOpen(!isReturnTimeOpen);
    setIsPickupOpen(false);
    setIsReturnOpen(false);
    setIsPickupTimeOpen(false);
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <input
      readOnly
      value={value}
      onClick={onClick}
      ref={ref}
      placeholder="Pick a date"
    />
  ));

  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  useEffect(() => {
    // Set return date to the day after pickup date
    const newReturnDate = new Date(pickupDate);
    newReturnDate.setDate(newReturnDate.getDate() + 1);
    setReturnDate(newReturnDate);
    
    // Set return time to 10:00 AM
    setReturnTime('05:00 PM');
  }, [pickupDate]);

  const handlePickupDateChange = (date) => {
    setPickupDate(date);
    // The useEffect hook will handle updating the return date and time
  };

  const categoryOptions = [
    { value: '', label: 'All' },
    { value: 'Ski', label: 'Ski' },
    { value: 'Snowboard', label: 'Snowboarding' },
    { value: 'Biking', label: 'Bike/eScooter' },
    { value: 'Camping', label: 'Camping' },
  ];

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
    //setIsCategoryOpen(true);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setIsCategoryOpen(false);
  };

  const getCategoryArrowIcon = () => {
    const isMobile = window.innerWidth <= 576; // Adjust this breakpoint if needed
    if (isMobile) {
      return isCategoryOpen ? <KeyboardArrowUpIcon className="arrow-icon" /> : <KeyboardArrowDownIcon className="arrow-icon" />;
    } else {
      return isCategoryOpen ? <KeyboardArrowUpIcon  className="arrow-icon" /> : <KeyboardArrowDownIcon className="arrow-icon" />;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // This will force a re-render when the window size changes
      setIsCategoryOpen(isCategoryOpen);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isCategoryOpen]);

  const formatDateTime = (date, time) => {
    const [hours, minutes] = time.split(':');
    const [minutesPart, ampm] = minutes.split(' ');
    let hour = parseInt(hours);
    
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }

    const newDate = new Date(date);
    newDate.setHours(hour, parseInt(minutesPart), 0);

    return newDate.toISOString();
  };

  const handleSearch = () => {
    const searchData = {
      location: location.address,
      radius: '0-20', // preset to 20 miles
      pickupDateTime: formatDateTime(pickupDate, pickupTime),
      returnDateTime: formatDateTime(returnDate, returnTime),
      category: category === '' ? 'all' : category
    };

    console.log('Search Data:', searchData);
    // Here you can send this data to your backend or perform any other action
     // Navigate to the CategoryPage with searchData
     navigate(`/gears/category/${searchData.category}`, { state: { searchData } });
  };


  return (
    <div className="slide-wrapper">
      <div className="card-container">
      <div className="card">
          <div className="location">
            <label>Where</label>
            <div className="input-with-icon">
              <SearchIcon className="search-icon" />
              {/* <input type="text" placeholder="1 Main St, Portland ME" /> */}
              <input
                type="text"
                placeholder="1 Main St, Portland ME"
                className="location-input"
                name="address"
                value={location.address}
                onChange={handleChangeLocation}
                ref={setInputElement}
              />
            </div>
          </div>
          <div className="datetime">
            <div className="pickup">
              <label>Pick up</label>
              <div className="date-time">
                <div className="date-picker-container" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPickupOpen) togglePickup();
                }}
                >
                  <CalendarTodayIcon className="calendar-icon" />
                  <DatePicker
                    selected={pickupDate}
                    onChange={handlePickupDateChange}
                    dateFormat="EEE MM/dd"
                    customInput={<CustomInput />}
                    open={isPickupOpen}
                    onClickOutside={togglePickup}
                    renderCustomHeader={CustomHeader}
                    minDate={new Date()}
                    filterDate={(date) => !isDateInPast(date)}
                    dayClassName={(date) =>
                      isDateInPast(date) ? "react-datepicker__day--disabled" : undefined
                    }
                  />
                  {isPickupOpen ? 
                    <KeyboardArrowUpIcon className="arrow-icon" /> : 
                    <KeyboardArrowDownIcon className="arrow-icon" />
                  }
                </div>
                <div className="time-select-container" onClick={togglePickupTime}>
                  <QueryBuilderIcon className="clock-icon" />
                  <select 
                    value={pickupTime} 
                    onChange={(e) => setPickupTime(e.target.value)}
                    onFocus={togglePickupTime}
                    onBlur={togglePickupTime}
                  >
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                  {isPickupTimeOpen ? (
                    <KeyboardArrowUpIcon className="arrow-icon" />
                  ) : (
                    <KeyboardArrowDownIcon className="arrow-icon" />
                  )}
                </div>
              </div>
            </div>
            <div className="return">
              <label>Return</label>
              <div className="date-time">
                <div className="date-picker-container" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isReturnOpen) toggleReturn();
                }}
                >
                  <CalendarTodayIcon className="calendar-icon" />
                  <DatePicker
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    dateFormat="EEE MM/dd"
                    customInput={<CustomInput />}
                    open={isReturnOpen}
                    onClickOutside={toggleReturn}
                    renderCustomHeader={CustomHeader}
                    minDate={pickupDate}
                    filterDate={(date) => !isDateInPast(date) && date >= pickupDate}
                    dayClassName={(date) =>
                      isDateInPast(date) || date < pickupDate ? "react-datepicker__day--disabled" : undefined
                    }
                  />
                  {isReturnOpen ? <KeyboardArrowUpIcon className="arrow-icon" /> : <KeyboardArrowDownIcon className="arrow-icon" />}
                </div>
                <div className="time-select-container" onClick={toggleReturnTime}>
                  <QueryBuilderIcon className="clock-icon" />
                  <select 
                    value={returnTime}  
                    onChange={(e) => setReturnTime(e.target.value)}
                    onFocus={toggleReturnTime}
                    onBlur={toggleReturnTime}
                  >
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                  {isReturnTimeOpen ? 
                    <KeyboardArrowUpIcon className="arrow-icon" /> : 
                    <KeyboardArrowDownIcon className="arrow-icon" />
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="category-container">
            {/* <span className="category-label">Category</span> */}
            <div className="category-select-container">
              <span className="category-icon">Category:</span>
              <select 
                value={category}
                onChange={handleCategoryChange}
                onFocus={toggleCategory}
                onBlur={toggleCategory}
              >
                <option value="" disabled>{category ? categoryOptions.find(opt => opt.value === category).label : 'Select Category'}</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {getCategoryArrowIcon()}
            </div>
          </div>
          <button className="search-btn" onClick={handleSearch}>
            Search {category}</button>
        </div>
      </div>
      <div className="slide-container">
        <div className="slide">
          <h1>
            Create a World where the Outdoors are more Accessible
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Slide
