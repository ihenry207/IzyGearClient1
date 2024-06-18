import { useEffect, useState } from "react";
import "../styles/List.css";
import Loading from "../components/loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setGearList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/footer"

const GearList = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const userId = useSelector((state) => state.user.userId);
  const GearList = useSelector((state) => state.user.GearList);

  const dispatch = useDispatch();

  const getGearList = async () => {
    try {
      const response = await fetch(
        `http://10.1.82.57:3001/users/${userId}/gears`,
        {
          method: "GET",
        }
      );

      if (response.status === 404) {
        setMessage("No current Gears found at this time");
      } else {
        const data = await response.json();
        dispatch(setGearList(data));
        
      }
      
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
      setMessage("An Error occured while fetching reservations. Try again later")
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getGearList();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Gear List</h1>
      {message ? (
        <p className="reservation-message">{message}</p>
      ): (
        <div className="list">
        {GearList?.map(({ _id, hostId, startDate, endDate, totalPrice, listing, booking = true }) => (
          <ListingCard
            key={_id}
            listingId={listing._id}
            creator={hostId}
            listingPhotoPaths={listing.listingPhotoPaths}
            address={listing.address}
            category={listing.category}
            condition={listing.condition}
            startDate={startDate}
            endDate={endDate}
            title = {listing.title}
            totalPrice={totalPrice}
            booking={booking}
          />
        ))}
      </div>
    )}
      <Footer />
    </>
  );
};

export default GearList;