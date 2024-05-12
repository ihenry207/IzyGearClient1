import React from 'react';
import { useParams } from 'react-router-dom';
import Listings from '../components/Listings';
import Navbar from "../components/Navbar"
import Footer from "../components/footer"

const CategoryPage = () => {
  const { category } = useParams();

  return (
    <div>
      <Navbar />
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Gear Listings</h1>
      <Listings category={category} />
      <Footer />
    </div>
  );
};

export default CategoryPage;