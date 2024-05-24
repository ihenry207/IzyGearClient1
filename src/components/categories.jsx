import React from 'react';
import '../styles/categories.css';
import { Link } from 'react-router-dom';

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
        
        <Link to="/gears/category/Camping">
          <div className="category">
            <img src="https://izygear.s3.us-east-2.amazonaws.com/profile-images/Campin.jpg" alt="Camping" />
            <div className="overlay"></div>
            <div className="category-text">
              
              <p>Camping</p>
            </div>
          </div>
        </Link>

        <Link to="/gears/category/Ski">
          <div className="category">
            <img src="https://izygear.s3.us-east-2.amazonaws.com/profile-images/skiing1.jpg" alt="Skiing" />
            <div className="overlay"></div>
            <div className="category-text">
              
              <p>Skiing</p>
            </div>
          </div>
        </Link>
        <Link to="/gears/category/Snowboard">
          <div className="category">
            <img src="https://izygear.s3.us-east-2.amazonaws.com/profile-images/Snowboarding.jpg" alt="Snowboarding" />
            <div className="overlay"></div>
            <div className="category-text">
              
              <p>Snowboarding</p>
            </div>
          </div>
        </Link>

        <Link to="/gears/category/Biking">
          <div className="category">
            <img src="https://izygear.s3.us-east-2.amazonaws.com/profile-images/Bike2.jpg" alt="Biking" />
            <div className="overlay"></div>
            <div className="category-text">
              
              <p>Biking</p>
            </div>
          </div>
        </Link>

        <Link to="/gears/category/all">
          <div className="category browse-all">
            <div className="overlay"></div>
            <div className="category-text">
              <p>Browse All</p>
              <span className="arrow">&#8594;</span>
            </div>
          </div>
        </Link>

        
      </div>
    </div>
  );
};

export default Categories;
