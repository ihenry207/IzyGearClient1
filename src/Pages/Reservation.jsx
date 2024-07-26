//this will show gears that are waiting for approval from the host
import { useEffect, useState } from "react";
import "../styles/List.css";
import Loading from "../components/loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/footer";
import Notification from '../components/notification/notification.jsx';
import { toast } from 'react-toastify';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(',', '').replace(/\s+/g, ' ').replace(/(\d+):(\d+)/, '$1:$2');
};

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [reservationList, setReservationList] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  const firebaseUid = useSelector(state => state.firebaseUid || '');
  //const reservationList = useSelector((state) => state.user.reservationList);

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.66:3001/reservations/${userId}/reservations`,
        {
          method: "GET",
        }
      );
  
      if (response.status === 404) {
        toast.warn("No current Reservation found at this time")
        //setMessage("No current Reservation found at this time");
      } else {
        const data = await response.json();
        
        // Format the dates in the received data
        const formattedData = data.map(reservation => ({
          ...reservation,
          startDate: formatDate(reservation.startDate),
          endDate: formatDate(reservation.endDate)
        }));
  
        setReservationList(formattedData); // Update the reservationList state with the formatted data
        console.log("reservation Info: ", formattedData);
      }
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
      toast.error("An error occurred while fetching reservations. Try again Later!")
      //setMessage("An error occurred while fetching reservations.");
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
      <div className="list-container">
        <h1 className="title-list">Reservation List</h1>
        <Notification/>
        {reservationList.length === 0 ? (
          <p className="reservation-message">No current Reservation found at this time</p>
        ) : (
          <div className="reservation-grid">
            {reservationList.map(({ reservationId, listing, startDate, endDate, totalPrice }) => (
              <div className="reservation-item" key={reservationId}>
                <ListingCard
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
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReservationList;
