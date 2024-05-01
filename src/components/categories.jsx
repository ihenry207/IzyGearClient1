import React from 'react';
import '../styles/categories.css';
import { Link } from 'react-router-dom';
// import BikeIcon from '../profile/BikeIcon.jpg';
// import CampingIcon from '../profile/CampingIcon.png';
// import SkiingIcon from '../profile/SkiingIcon.png';
// import SnowboardingIcon from '../profile/snowboardingIcon.png';

const Categories = () => {
  return (
    <div className="categories">
      <h1>Explore Top Categories</h1>
      <p>
        Explore our wide range of outdoor gear rentals that cater to all types of
        adventurers. Immerse yourself in the great outdoors, enjoy the thrill of
        adventure, and create unforgettable memories in your favorite activities.
      </p>
      <div className="categories-list">
        
        <Link to="/gears/category/camping">
          <div className="category">
            <img src="/profile/Campin.jpg" alt="Camping" />
            <div className="overlay"></div>
            <div className="category-text">
              
              <p>Camping</p>
            </div>
          </div>
        </Link>

        <Link to="/gears/category/skiing">
          <div className="category">
            <img src="/profile/Skiing1.jpg" alt="Skiing" />
            <div className="overlay"></div>
            <div className="category-text">
              
              <p>Skiing</p>
            </div>
          </div>
        </Link>
        <Link to="/gears/category/snowboarding">
          <div className="category">
            <img src="/profile/Snowboarding.jpg" alt="Snowboarding" />
            <div className="overlay"></div>
            <div className="category-text">
              
              <p>Snowboarding</p>
            </div>
          </div>
        </Link>

        <Link to="/gears/category/biking">
          <div className="category">
            <img src="/profile/Bike2.jpg" alt="Biking" />
            <div className="overlay"></div>
            <div className="category-text">
              
              <p>Biking</p>
            </div>
          </div>
        </Link>

        
      </div>
    </div>
  );
};

export default Categories;
