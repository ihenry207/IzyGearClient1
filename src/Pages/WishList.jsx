import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);
  const [wishListItems, setWishListItems] = useState([]);

  useEffect(() => {
    const fetchWishListItems = async () => {
      try {
        const itemPromises = wishList.map(async (item) => {
          const response = await fetch(
            `http://10.1.82.57:3001/users/listings/${item.listingType}/${item.listingId}`
          );
          const data = await response.json();
          return data;
        });

        const items = await Promise.all(itemPromises);
        setWishListItems(items);
      } catch (error) {
        console.log("Error fetching wishlist items:", error);
      }
    };

    fetchWishListItems();
  }, [wishList]);

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Wish List</h1>
      <div className="list">
        {wishListItems
          .filter((item) => item && item._id)
          .map((item) => (
            <ListingCard
              key={item._id}
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
            />
          ))}
      </div>
    </>
  );
};

export default WishList;