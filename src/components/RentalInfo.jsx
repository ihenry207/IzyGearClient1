import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RentalInfo.css';

const RentalInfo = () => {
  return (
    <div className="rental-info">
      <div className="rental-info-text">
        <p>
        IzyGear makes it simple and cheap to rent outdoor equipments. 
        Our listings comes from people who have outdoor equipment/Gear 
        currently not in use and wants to rent them out.
        </p>
      </div>
      <div className="list-gear-section">
        <p>List your current gear on IzyGear and open doors to more income</p>
        <Link to="/create-listing">
          <button className="list-gear-button">List My Gear Now!</button>
        </Link>
      </div>
    </div>
  );
};

export default RentalInfo;