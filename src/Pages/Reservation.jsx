import { useEffect, useState } from "react";
import "../styles/List.css";
import Loading from "../components/loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
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
  const [reservationList, setReservationList] = useState([]);
  const userId = useSelector((state) => state.user.userId);

  const getReservationList = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.66:3001/reservations/${userId}/reservations`,
        {
          method: "GET",
        }
      );
  
      if (response.status === 404) {
        toast.warn("No current Reservation found at this time");
      } else {
        const data = await response.json();
        
        const formattedData = data.map(reservation => ({
          ...reservation,
          startDate: new Date(reservation.startDate),
          endDate: new Date(reservation.endDate)
        }));
  
        setReservationList(formattedData);
        console.log("reservation Info: ", formattedData);
      }
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
      toast.error("An error occurred while fetching reservations. Try again Later!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReservationList();
  }, []);

  const currentDate = new Date();
  const upcomingReservations = reservationList.filter(reservation => reservation.startDate > currentDate);
  const pastReservations = reservationList.filter(reservation => reservation.startDate <= currentDate);

  const renderReservations = (reservations) => (
    <div className="reservation-grid">
      {reservations.map(({ reservationId, listing, startDate, endDate, totalPrice }) => (
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
            startDate={formatDate(startDate)}
            endDate={formatDate(endDate)}
            totalPrice={totalPrice}
            booking={true}
          />
        </div>
      ))}
    </div>
  );

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
          <>
            <h2>Upcoming Reservations</h2>
            {upcomingReservations.length > 0 ? renderReservations(upcomingReservations) : (
              <p>No upcoming reservations</p>
            )}
            
            <h2>Past Reservations</h2>
            {pastReservations.length > 0 ? renderReservations(pastReservations) : (
              <p>No past reservations</p>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReservationList;