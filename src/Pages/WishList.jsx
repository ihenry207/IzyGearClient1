import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";
import "../styles/List.css";
import Footer from "../components/footer";
import Loading from "../components/loader";
import Notification from '../components/notification/notification.jsx';
import { toast } from 'react-toastify';

const WishList = () => {
  const userId = useSelector((state) => state.user.userId);
  const [wishListItems, setWishListItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likeToggle, setLikeToggle] = useState(false); // New state for tracking like toggles

  const getWishList = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.1.66:3001/users/${userId}/wishlist`,
        {
          method: "GET",
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log("Wishlist:", data);
        setWishListItems(Array.isArray(data) ? data : []);
      } else if (response.status === 404) {
        toast.warn("No WishList items found at this time");
        setWishListItems([]);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.log("Fetch Wishlist failed!", err.message);
      toast.error("Fetch WishList failed! Try again later");
      setWishListItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getWishList();
    }
  }, [userId, likeToggle]); // Add likeToggle to the dependency array
  
  if (loading) return <Loading />;

  // Function to handle like toggle
  const handleLikeToggle = () => {
    setLikeToggle(prev => !prev);
  };

  return (
    <>
      <Navbar />
      <div className="list-container">
        <h1 className="title-list">WishList</h1>
        <Notification/>
        {!Array.isArray(wishListItems) || wishListItems.length === 0 ? (
          <p className="reservation-message">No items in your wishlist at this time</p>
        ) : (
          <div className="reservation-grid">
            {wishListItems
              .filter((item) => item && item._id)
              .map((item) => (
                <div className="reservation-item" key={item._id}>
                  <ListingCard
                    listingId={item._id}
                    creator={item.creator}
                    listingPhotoPaths={item.listingPhotoPaths || []}
                    address={item.address}
                    category={item.category}
                    title={item.title}
                    price={item.price}
                    condition={item.condition}
                    startDate={item.startDate}
                    endDate={item.endDate}
                    totalPrice={item.totalPrice}
                    booking={item.booking || false}
                    onLikeToggle={handleLikeToggle} // Pass the handleLikeToggle function to ListingCard
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WishList;