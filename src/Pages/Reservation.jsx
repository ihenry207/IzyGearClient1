//this will show gears that are waiting for approval from the host
import { useEffect, useState } from "react";
import "../styles/List.css";
import Loading from "../components/loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/footer";

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const userId = useSelector((state) => state.user._id);
  const reservationList = useSelector((state) => state.user.reservationList);

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await fetch(
        `http://10.1.82.57:3001/users/${userId}/reservations`,
        {
          method: "GET",
        }
      );

      if (response.status === 404) {
        setMessage("No current Reservation found at this time");
      } else {
        const data = await response.json();
        dispatch(setReservationList(data));
      }
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
      setMessage("An error occurred while fetching reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReservationList();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      {message ? (
        <p className="reservation-message">{message}</p>
      ) : (
        <div className="list">
          {reservationList?.map(({ listingId, hostId, startDate, endDate, totalPrice, booking = true }) => (
            <ListingCard
              key={listingId._id}
              listingId={listingId._id}
              creator={hostId._id}
              listingPhotoPaths={listingId.listingPhotoPaths}
              city={listingId.city}
              state={listingId.state}
              title ={listingId.title}
              country={listingId.country}
              category={listingId.category}
              startDate={startDate}
              endDate={endDate}
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

export default ReservationList;
