import "../styles/List.css";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState } from "react";
import { setOwnerGearList } from "../redux/state";
import Loader from "../components/loader";
import Footer from "../components/footer";

const Listings = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const ownerGearList = user?.ownerGearList;
  console.log(user);
  const dispatch = useDispatch();

  const getListings = async () => {
    try {
      const response = await fetch(`http://10.1.82.57:3001/users/${user._id}/listings`, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
      dispatch(setOwnerGearList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };

  useEffect(() => {
    getListings();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {ownerGearList?.map(
          ({
            _id,
            creator,
            listingPhotoPaths,
            city,
            state,
            country,
            title,
            category,
            type,
            price,
            condition,
            booking = false,
          }) => (
            <ListingCard
              key={_id}
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              state={state}
              condition={condition}
              country={country}
              category={category}
              title={title}
              type={type}
              price={price}
              booking={booking}
            />
          )
        )}
      </div>
      <Footer />
    </>
  );
};

export default Listings;