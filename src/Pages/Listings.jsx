import { useEffect, useState } from "react";
import "../styles/List.css";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/footer";
import Loading from "../components/loader";
import Notification from '../components/notification/notification.jsx';
import { toast } from 'react-toastify';

const Listings = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [ownerGearList, setOwnerGearList] = useState([]);
  const userId = useSelector((state) => state.user.userId);

  const getOwnerGearList = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.66:3001/users/${userId}/ownerGear`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Owner Gear list:", data);
        setOwnerGearList(data);
      } else if (response.status === 404) {
        toast.warn("No listed gears found at this time");
        //setMessage("No listed gears found at this time");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.log("Fetch Owner Gear List failed!", err.message);
      toast.error("Fetch Owner Gear List failed! Try Later")
      //setMessage("An error occurred while fetching your listed gears. Try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOwnerGearList();
  }, [userId]);

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="list-container">
        <h1 className="title-list">Listed Gears</h1>
        <Notification/>
        {ownerGearList.length === 0 ? (
          <p className="reservation-message">No listed gears found at this time</p>
        ) : (
          <div className="reservation-grid">
            {ownerGearList.map((gear) => (
              <div className="reservation-item" key={gear._id}>
                <ListingCard
                  listingId={gear._id}
                  creator={gear.creator._id}
                  listingPhotoPaths={gear.listingPhotoPaths}
                  address={gear.address}
                  condition={gear.condition}
                  category={gear.category}
                  title={gear.title}
                  type={gear.type}
                  price={gear.price}
                  booking={false}
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

export default Listings;