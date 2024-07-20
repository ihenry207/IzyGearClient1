import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css';
import React, { useState } from 'react';
//import { UserProvider } from './UserContext';
import Home from './Pages/Home.jsx';
import Footer from './components/footer.jsx';
import AboutUs from './Pages/About.jsx';
import HowItWorks from './Pages/howItWorks.jsx';
import Register from './Pages/register.jsx';
import SignIn from './Pages/login.jsx';
import CreateListing from "./Pages/createListing";
import GearList from "./Pages/GearList";
import WishList from "./Pages/WishList";
import Listings from "./Pages/Listings";
import ReservationList from "./Pages/Reservation";
import CategoryPage from "./Pages/CategoryPage.jsx";
import SearchPage from "./Pages/SearchPage";
import ListingDetails from "./Pages/ListingDetails";
//import AboutUs from ".pages/About"
import Contacts from "./Pages/contact"
import Privacy from "./Pages/privacy"
import Terms from "./Pages/Terms"
import ChatPage from "./Pages/chat.jsx";
import Profile from "./Pages/Profile.jsx";
import ReviewPage from "./Pages/ReviewPage.jsx";

//import Footer from "./components/footer"
function App() { 
  //const [creatorFirebaseUid, setCreatorFirebaseUid] = useState(null);
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path = '/' element = {<Home />} />
            <Route path = '/register' element = {<Register />} />
            <Route path = '/login' element = {<SignIn />} />
            <Route path= '/create-listing' element={<CreateListing />} />
            <Route path = '/:userId/gears' element = {<GearList />} />
            <Route path="/:userId/wishList" element={<WishList />} />
            <Route path="/:userId/listings" element={<Listings />} />
            <Route path="/:userId/reservations" element={<ReservationList />} />
            <Route path="/gears/listingdetail" element={<ListingDetails />} />
            <Route path="/gears/category/:category" element={<CategoryPage />} />
            <Route path="/gears/search/:search" element={<SearchPage />} />
            <Route path ="/contact-us" element={<Contacts />} />
            <Route path ="/privacy" element={<Privacy />} />
            <Route path ="/terms" element={<Terms />} />
            <Route path ="/:userId/chats" element={<ChatPage />} />
            <Route path = "/:userId/profile" element={<Profile />} />
            <Route path = "/about-us" element={<AboutUs />} />
            <Route path = "/how-it-works" element={<HowItWorks />} />
            <Route path = "/reviews/:reservationId" element={<ReviewPage />} />
            {/* <Route path ="/:userId/chats/:chatId" element={<Terms />} /> */}
          </Routes>
        </BrowserRouter> 
    </div>
  );
}

export default App;
