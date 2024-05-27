import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RentalInfo.css';
import { useSelector, useDispatch } from "react-redux";

const RentalInfo = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleListGearClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/create-listing");
    }
  };
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

        
          <button className="list-gear-button" onClick={handleListGearClick}>
            List My Gear Now!</button>
        
      </div>
    </div>
  );
};

export default RentalInfo;