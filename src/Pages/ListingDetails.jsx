import React, { useEffect, useState } from "react";
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
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnTime, setReturnTime] = useState('05:00 PM');
  const [isPickupTimeOpen, setIsPickupTimeOpen] = useState(false);
  const [isReturnTimeOpen, setIsReturnTimeOpen] = useState(false);
  const [firebaseChatId, setfirebaseChatId] = useState('');
  const [diffDays, setDiffDays] = useState(0);
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
          setfirebaseChatId(chatId);
          console.log("Chat created or found. ChatId:", chatId);
          return chatId; // Return the chatId
        } else {
          console.log("Failed to create or find chat");
          return null;
        }
      } else {
        console.log("No user found with this ID");
        setUserFirebase(null);
        return null;
      }
    } catch (err) {
      console.log(err);
      setUserFirebase(null);
      return null;
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
  //Setting default dates to tomorrow and day after tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const [dateRange, setDateRange] = useState([
    {
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      key: "selection",
    },
  ]);

  

  const togglePickupTime = () => {
    setIsPickupTimeOpen(!isPickupTimeOpen);
    setIsReturnTimeOpen(false);
  };

  const toggleReturnTime = () => {
    setIsReturnTimeOpen(!isReturnTimeOpen);
    setIsPickupTimeOpen(false);
  };

  const handleSelect = (ranges) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (ranges.selection.startDate >= today) {
      setDateRange([ranges.selection]);
    }
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  });

  //I need to call updateDiffDays whenever the pickup or return time changes:
  useEffect(() => {
    const calculateDiffDays = () => {
      if (!dateRange[0] || !dateRange[0].startDate || !dateRange[0].endDate) {
        setDiffDays(0);
        return;
      }

      const start = new Date(dateRange[0].startDate);
      const end = new Date(dateRange[0].endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setDiffDays(0);
        return;
      }

      // Parse and set the times
      const [startHour, startMinute, startPeriod] = pickupTime.split(/:| /);
      const [endHour, endMinute, endPeriod] = returnTime.split(/:| /);
      
      start.setHours(
        startPeriod === 'PM' ? (parseInt(startHour) % 12) + 12 : parseInt(startHour) % 12,
        parseInt(startMinute)
      );
      end.setHours(
        endPeriod === 'PM' ? (parseInt(endHour) % 12) + 12 : parseInt(endHour) % 12,
        parseInt(endMinute)
      );
  
      //Changed calculation to always charge for at least one day
      const diffTime = Math.abs(end - start);
      const calculatedDiffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setDiffDays(calculatedDiffDays);
    };
  
    calculateDiffDays();
  }, [dateRange, pickupTime, returnTime]);

  // const start = new Date(dateRange[0].startDate);
  // const end = new Date(dateRange[0].endDate);
  // const diffTime = Math.abs(end - start);
  // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
      const creatorFirebaseUid = listing.creatorFirebaseUid;
      if (customerId === listing.creator._id) {
        setErrorMessage("You can't book your own gear.");
        return;
      }

      if (!dateRange[0] || !dateRange[0].startDate || !dateRange[0].endDate) {
        setErrorMessage("Please select a valid date range.");
        console.log("Please select a valid date range.")
        return;
      }

      let totalPrice;
      if (diffDays === 0) {
        totalPrice = listing.price;
      } else {
        totalPrice = listing.price * diffDays;
      }

      const reservationForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: `${dateRange[0].startDate.toDateString()} ${pickupTime}`,
        endDate: `${dateRange[0].endDate.toDateString()} ${returnTime}`,
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
        const reservationInfo = await response.json();
        
        // Call handleSearch2 and await its result
        const chatId = await handleSearch2(listing.creatorFirebaseUid);
        
      
        if (chatId) {
          let chatForm = {
            reservationId: reservationInfo.reservationId,
            chatId: chatId
          };
          console.log("Here is chatForm inside of listingdetails: ",chatForm)
      
          // Send the chat info to backend
          const chatResponse = await fetch("http://10.1.82.57:3001/reservations/chatId", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(chatForm),
          });
      
          if (chatResponse.ok) {
            console.log("ChatId added successfully");
          } else {
            console.error("Failed to add ChatId");
          }
        } else {
          console.error("Failed to obtain chatId");
          // Handle this error case appropriately
        }
      
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
          {/* DateRange container */}
          <div className="date-range-container">
            <DateRange
              ranges={dateRange}
              onChange={handleSelect}
              minDate={new Date()}
            />
          </div>

          {/* Pickup and Return Time container */}
          <div className="time-picker-container">
            <div className="time-picker">
              <label>Pickup Time:</label>
              <div className="time-select-container2" onClick={togglePickupTime}>
                <QueryBuilderIcon className="clock-icon" />
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  onFocus={togglePickupTime}
                  onBlur={togglePickupTime}
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
                {isPickupTimeOpen ? (
                  <KeyboardArrowUpIcon className="arrow-icon" />
                ) : (
                  <KeyboardArrowDownIcon className="arrow-icon" />
                )}
              </div>
            </div>
            <div className="time-picker">
              <label>Return Time:</label>
              <div className="time-select-container2" onClick={toggleReturnTime}>
                <QueryBuilderIcon className="clock-icon" />
                <select
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  onFocus={toggleReturnTime}
                  onBlur={toggleReturnTime}
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
                {isReturnTimeOpen ? (
                  <KeyboardArrowUpIcon className="arrow-icon" />
                ) : (
                  <KeyboardArrowDownIcon className="arrow-icon" />
                )}
              </div>
            </div>
          </div>

          {/* Pricing information */}
          <div className="pricing-info">
            <h2>${listing.price} x {diffDays} day{diffDays > 1 ? 's' : ''}</h2>
            <h2>Total price: ${listing.price * diffDays}</h2>
            <p>From: {dateRange[0] && dateRange[0].startDate instanceof Date 
              ? `${dateRange[0].startDate.toDateString()} ${pickupTime}` 
              : 'Select a start date'}</p>
            <p>Until: {dateRange[0] && dateRange[0].endDate instanceof Date 
              ? `${dateRange[0].endDate.toDateString()} ${returnTime}` 
              : 'Select an end date'}</p>
          </div>

          {/* Reserve button container */}
          <div className="reserve-button-container">
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
