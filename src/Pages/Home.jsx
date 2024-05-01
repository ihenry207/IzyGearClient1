import React from 'react'
import Navbar from "../components/Navbar"
import Slide from "../components/Slide"
import Categories from "../components/categories"
import RentaInfo from "../components/RentalInfo"
import Footer from "../components/footer"
const Home = () => {
  return (
    <div>
      <Navbar />
      <Slide />
      <Categories />
      <RentaInfo />
      <Footer />
    </div>
  )
}

export default Home
