import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";
import "../styles/List.css";

const WishList = () => {
  const wishListItems = useSelector((state) => state?.wishList);
  //const [wishListItems, setWishListItems] = useState([]);
  //const userId = useSelector((state) => state.user.userId);//first get userId and use that to search in database

  

  return (
    <>
      <Navbar />
      <div className="list-container">
      <h1 className="title-list">WishList</h1>
      <div className="list">
        {wishListItems?.filter((item) => item && item._id)
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
      </div>
    </>
  );
};

export default WishList;