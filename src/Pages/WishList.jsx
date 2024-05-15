import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";

const WishList = () => {
  const user = useSelector((state) => state.user);
  const [wishListItems, setWishListItems] = useState([]);

  useEffect(() => {
    const fetchWishListItems = async () => {
      try {
        const response = await fetch(`http://10.1.82.57:3001/users/${user._id}/wishlist`);
        const data = await response.json();
        setWishListItems(data);
      } catch (error) {
        console.log("Error fetching wishlist items:", error);
      }
    };

    if (user && user._id) {
      fetchWishListItems();
    }
  }, [user]);

  return (
    <>
    <Navbar />
    
      <h1 className="title-list">Your Wish List</h1>
      <div className="list">
        {wishListItems.map((item) => {
          if (item) {
            return (
              <ListingCard
                key={item._id}
                listingId={item._id}
                creator={item.creator}
                listingPhotoPaths={item.listingPhotoPaths}
                city={item.city}
                state={item.state}
                country={item.country}
                category={item.category}
                title={item.title}
                price={item.price}
                condition={item.condition}
                startDate={item.startDate}
                endDate={item.endDate}
                totalPrice={item.totalPrice}
                booking={item.booking || false}
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

export default WishList;