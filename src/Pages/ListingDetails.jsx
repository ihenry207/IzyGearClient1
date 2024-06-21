import React, { useEffect, useState, useContext } from "react";
import "../styles/ListingDetails.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loading from "../components/loader";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../components/footer";
import ImageGallery from "../components/ImageGallery";
import { Favorite, FavoriteBorder  } from "@mui/icons-material";
import { setWishList } from "../redux/state";
import parseAddress from "parse-address";
import { db } from "../lib/firebase";
//import { doc, getDoc } from "firebase/firestore";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
//import UserContext from '../UserContext';

//since there is no userId we need to transfer the category from listingcard 
//to listingdetails directly no through useparams
const parseCustomAddress = (address) => {
  if (!address) return { city: 'N/A', state: 'N/A', country: 'N/A' };
  
  const parts = address.split(', ');
  return {
    city: parts.length > 2 ? parts[parts.length - 3] : 'N/A',
    state: parts.length > 1 ? parts[parts.length - 2].split(' ')[0] : 'N/A',
    country: parts[parts.length - 1] || 'N/A'
  };
};

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  //const { setCreatorFirebaseUid } = useContext(UserContext);
  const [listing, setListing] = useState(null);
  const [userFirebase, setUserFirebase] = useState(null);
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);
  const { category, listingId } = location.state;
  const customerFirebaseUid = useSelector(state => state.firebaseUid || '');
  const [errorMessage, setErrorMessage] = useState("");
  let address = listing?.address;
  let city, state, country;

  if (address) {
    const parsedAddress = parseAddress.parseLocation(address);
    city = parsedAddress.city;
    state = parsedAddress.state;
    country = address.split(", ").pop() || "";

    if (!city || !state) {
      // If city or state is undefined, use custom parsing
      const customParsed = parseCustomAddress(address);
      city = customParsed.city;
      state = customParsed.state;
    }
  } else {
    const customParsed = parseCustomAddress(address);
    city = customParsed.city;
    state = customParsed.state;
    country = customParsed.country;
  }

  let truncatedTitlenow;
  if (address) {
    if (city === 'N/A' && state === 'N/A') {
      truncatedTitlenow = country;
    } else if (city === 'N/A') {
      truncatedTitlenow = `${state}, ${country}`;
    } else if (state === 'N/A') {
      truncatedTitlenow = `${city}, ${country}`;
    } else {
      truncatedTitlenow = `${city}, ${state}, ${country}`;
    }
  } else {
    truncatedTitlenow = "N/A";
  }
  
 
  const handleSearch2 = async (hostUid) => {
    try {
      const userRef = doc(db, "users", hostUid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserFirebase(userData);
        console.log("User found:", userData);

        // Call handleAdd here
        const chatId = await handleAdd(customerFirebaseUid, hostUid);
        if (chatId) {
          console.log("Chat created or found. ChatId:", chatId);
          // You can use this chatId to navigate to the chat or update UI
        }
      } else {
        console.log("No user found with this ID");
        setUserFirebase(null);
      }
    } catch (err) {
      console.log(err);
      setUserFirebase(null);
    }
  };

  const handleAdd = async (customerUid, hostUid) => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
  
    try {
      // Check if a chat already exists between these two users
      const q = query(
        chatRef,
        where('participants', 'array-contains', customerUid)
      );
      const querySnapshot = await getDocs(q);
      
      let existingChatId = null;
      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.participants.includes(hostUid)) {
          existingChatId = doc.id;
        }
      });
  
      if (existingChatId) {
        console.log("Chat already exists. ChatId:", existingChatId);
        return existingChatId; // Return existing chat id
      }
  
      // If no existing chat, create a new one
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
        participants: [customerUid, hostUid]
      });
  
      const chatData = {
        chatId: newChatRef.id,
        lastMessage: "",
        updatedAt: Date.now(),
      };
  
      await updateDoc(doc(userChatsRef, hostUid), {
        chats: arrayUnion({
          ...chatData,
          receiverId: customerUid,
        }),
      });
  
      await updateDoc(doc(userChatsRef, customerUid), {
        chats: arrayUnion({
          ...chatData,
          receiverId: hostUid,
        }),
      });
  
      console.log("New chat created. ChatId:", newChatRef.id);
      return newChatRef.id; // Return new chat id
    } catch (err) {
      console.log("Error in handleAdd:", err);
      return null;
    }
  };

  const openImageGallery = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageGallery = () => {
    setSelectedImage(null);
  };

  const getListingDetails = async () => {
    try {
      let apiUrl = "";
      //I could also fetch booked dates to blur out those days, if in past don't blur
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
      console.log("data of current listings: ",data)
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (ranges.selection.startDate >= today) {
      setDateRange([ranges.selection]);
    }
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24);

  /* SUBMIT Reservation */
  const User = useSelector((state) => state.user);
  const customerId = User?.userId;
  // const customerId = useSelector((state) => state.user.userId);
  //const creatorID = //get it from the database so that I won't allow others to book their own gear
  //meaning if customerID === creatorID send a message before even booking.
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }
      console.log("Here is Listing details", listing)
      console.log("Here is creator's Id: ",listing.creator._id, )
      console.log("Here is the customerId: ", customerId)
      const creatorFirebaseUid = listing.creatorFirebaseUid;
      if (customerId === listing.creator._id) {
        setErrorMessage("You can't book your own gear.");
        return;
      }

      let totalPrice;
      if (dateRange[0].startDate.toDateString() === dateRange[0].endDate.toDateString()) {
        totalPrice = listing.price;
      } else {
        totalPrice = listing.price * dayCount;
      }

      //here we also need to get their firebaseID for both customer 
      //and host so we can link them over chat
      //get customer FirebaseUid, and get creator firebaseUid to connect them through chat
      //which means that when we create a listing we need to transfer the firebaseUid to the listing
      const reservationForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: totalPrice,
        category,
        creatorFirebaseUid,
        customerFirebaseUid,
      };

      

      console.log("Here is the Reservation form: ", reservationForm)

      const response = await fetch("http://10.1.82.57:3001/reservations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationForm),
      });

      if (response.ok) {
        // setCreatorFirebaseUid(creatorFirebaseUid);
        // Call handleSearch2 with the creator's Firebase UID
        await handleSearch2(listing.creatorFirebaseUid);
        navigate(`/${customerId}/reservations`);
        
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
    }
  };

  /* ADD TO WISHLIST */
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];
  const isLiked = wishList?.find((item) => item?._id === listingId);
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    setIsFavorite(isLiked !== undefined);
  }, [isLiked]);

  const toggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      const response = await fetch(
        `http://10.1.82.57:3001/users/${user?.userId}/${category}/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ listing })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message);
      }

      const data = await response.json();
      console.log("Updated wishList:", data.wishList);
      dispatch(setWishList(data.wishList));
    } catch (error) {
      console.log("Error updating wishlist:", error);
      setErrorMessage("Error updating wishlist");
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <Navbar />
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button
            className="close-button"
            onClick={() => setErrorMessage("")}
          >
            ✖
          </button>
        </div>
      )}
      <div className="listing-details">
        <div className="title-container">
          <h1>{listing.title}</h1>
          <button
            className="favorite-icon"
            onClick={toggleFavorite}
            disabled={!user}
          >
            {isFavorite ? (
            <Favorite sx={{ color: "red" }} />
          ) : (
            <FavoriteBorder sx={{ color: "black" }} />
          )}
          </button>
        </div>
        <div className="photos">
          {listing.listingPhotoPaths?.slice(0, 3).map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt="listing photo"
              onClick={openImageGallery}
              className="photo-item"
            />
          ))}
          {listing.listingPhotoPaths?.length > 3 && (
            <div className="view-more" onClick={openImageGallery}>
              <div className="view-more-overlay"></div>
              <img src={listing.listingPhotoPaths[3]} alt="listing photo" className="photo-item" />
              <span className="view-more-text">View {listing.listingPhotoPaths.length - 3}+ images</span>
            </div>
          )}
        </div>
        {selectedImage && (
          <ImageGallery
            images={listing.listingPhotoPaths}
            onClose={closeImageGallery}
          />
        )}
        <h2>
          {/* this is for the address where I put city and state and country */}
          {truncatedTitlenow} 
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
            <DateRange ranges={dateRange} onChange={handleSelect} minDate={new Date()} />
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
              Reserve
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingDetails;
