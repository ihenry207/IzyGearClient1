import React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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

export default CustomHeader;