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
  const [reservationList, setReservationList] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  //const reservationList = useSelector((state) => state.user.reservationList);

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await fetch(
        `http://10.1.82.57:3001/reservations/${userId}/reservations`,
        {
          method: "GET",
        }
      );
  
      if (response.status === 404) {
        setMessage("No current Reservation found at this time");
      } else {
        const data = await response.json();
        setReservationList(data); // Update the reservationList state with the received data
        console.log("reservation Info: ", data);
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
          {reservationList?.map(({ listing, startDate, endDate, totalPrice }) => (
            <ListingCard
              key={listing._id}
              listingId={listing._id}
              creator={listing.creator}
              listingPhotoPaths={listing.listingPhotoPaths}
              address={listing.address}
              category={listing.category}
              condition={listing.condition}
              title={listing.title}
              price={listing.price}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              booking={true}
            />
          ))}
        </div>
      )}
      <Footer />
    </>
  );
};

export default ReservationList;
