import { useEffect, useState } from "react";
import "../styles/ListingDetails.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/footer";
import ImageGallery from "../components/ImageGallery";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const location = useLocation();
  const category = location.state?.category;
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageGallery = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageGallery = () => {
    setSelectedImage(null);
  };

  const getListingDetails = async () => {
    try {
      let apiUrl = "";
      if (category === "Ski" || category === "Snowboard") {
        apiUrl = `http://10.1.82.57:3001/gears/skisnow/${listingId}`;
      } else if (category === "Biking") {
        apiUrl = `http://10.1.82.57:3001/gears/biking/${listingId}`;
      } else if (category === "Camping") {
        apiUrl = `http://10.1.82.57:3001/gears/camping/${listingId}`;
      }

      const response = await fetch(apiUrl, {
        method: "GET",
      });

      const data = await response.json();
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24);

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      const response = await fetch("http://10.1.82.57:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      if (response.ok) {
        navigate(`/${customerId}/gears`);
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
        </div>
        <div className="photos">
          {listing.listingPhotoPaths?.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt="listing photo"
              onClick={() => openImageGallery(imageUrl)}
            />
          ))}
        </div>
        {selectedImage && (
          <ImageGallery
            images={listing.listingPhotoPaths}
            onClose={closeImageGallery}
          />
        )}
        <h2>
          {listing.city}, {listing.state}, {listing.country}
        </h2>
        <p>Category: {category}</p>
        <div className="profile">
          <img
            src={listing.creator.profileImagePath}
            alt="Owner profile"
          />
          <h3>
            Owned by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <h3>Description</h3>
        <p>{listing.description}</p>
        <div className="booking">
          <h2>How long do you want to book?</h2>
          <div className="date-range-calendar">
            <DateRange ranges={dateRange} onChange={handleSelect} />
            {dayCount > 1 ? (
              <h2>
                ${listing.price} x {dayCount} days
              </h2>
            ) : (
              <h2>
                ${listing.price} x {dayCount} day
              </h2>
            )}
            <h2>Total price: ${listing.price * dayCount}</h2>
            <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
            <p>End Date: {dateRange[0].endDate.toDateString()}</p>
            <button className="button" type="submit" onClick={handleSubmit}>
              BOOK
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingDetails;