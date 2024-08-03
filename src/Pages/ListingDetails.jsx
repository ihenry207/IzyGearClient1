import React, { useEffect, useState, useCallback } from "react";
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
//import { setWishList } from "../redux/state";
import parseAddress from "parse-address";
import { db } from "../lib/firebase";
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Notification from '../components/notification/notification.jsx';
import { toast } from 'react-toastify';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { debounce } from 'lodash';
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
  const [disabledDates, setDisabledDates] = useState([]);
  const { category, listingId } = location.state;
  const customerFirebaseUid = useSelector(state => state.firebaseUid || '');
  const [errorMessage, setErrorMessage] = useState("");
  const User = useSelector((state) => state.user);
  const customerId = User?.userId;
  const navigate = useNavigate();
  const [isReserving, setIsReserving] = useState(false);
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
        apiUrl = `http://192.168.1.66:3001/gears/skisnow/${listingId}`;
      } else if (category === "Biking") {
        apiUrl = `http://192.168.1.66:3001/gears/biking/${listingId}`;
      } else if (category === "Camping") {
        apiUrl = `http://192.168.1.66:3001/gears/camping/${listingId}`;
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

  const isDateBooked = (date, bookedDates) => {
    return bookedDates.some(range => 
      date >= new Date(range.start) && date <= new Date(range.end)
    );
  };

  const findNextAvailableDates = (bookedDates) => {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    
    while (isDateBooked(startDate, bookedDates)) {
      startDate.setDate(startDate.getDate() + 1);
    }
    
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Set end date to the day after start date
    
    while (isDateBooked(endDate, bookedDates)) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    return { startDate, endDate };
  };

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
  
    // const isStartDateDisabled = disabledDates.some(
    //   disabledDate => 
    //     disabledDate instanceof Date && 
    //     ranges.selection.startDate.toDateString() === disabledDate.toDateString()
    // );
  
    // let endDate = ranges.selection.endDate;
    // if (!endDate || endDate < ranges.selection.startDate) {
    //   endDate = ranges.selection.startDate;
    // }
  
    // const isEndDateDisabled = disabledDates.some(
    //   disabledDate => 
    //     disabledDate instanceof Date && 
    //     endDate.toDateString() === disabledDate.toDateString()
    // );
  
    // if (ranges.selection.startDate >= today && !isStartDateDisabled && !isEndDateDisabled) {
    //   setDateRange([{
    //     startDate: ranges.selection.startDate,
    //     endDate: endDate,
    //     key: "selection"
    //   }]);
    // }
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  });

  const formatBookedDates = (bookedDates) => {
    let disabledDatesArray = [];
    bookedDates.forEach(dateRange => {
      let currentDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      while (currentDate <= endDate) {
        disabledDatesArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return disabledDatesArray;
  };

  // useEffect(() => {
  //   if (listing && listing.BookedDates) {
  //     const { startDate, endDate } = findNextAvailableDates(listing.BookedDates);
  //     setDateRange([
  //       {
  //         startDate,
  //         endDate,
  //         key: "selection"
  //       }
  //     ]);
  //     const formattedDates = formatBookedDates(listing.BookedDates);
  //     setDisabledDates(formattedDates.filter(date => date instanceof Date && !isNaN(date)));
  //   }
  // }, [listing]);
  useEffect(() => {
    if (listing && listing.BookedDates) {
      const formattedDates = formatBookedDates(listing.BookedDates);
      setDisabledDates(formattedDates.filter(date => date instanceof Date && !isNaN(date)));
    }
  }, [listing]);

  // const dayContentRenderer = (date) => {
  //   const isDisabled = disabledDates.some(
  //     disabledDate => 
  //       disabledDate instanceof Date && 
  //       date.toDateString() === disabledDate.toDateString()
  //   );
  //   return (
  //     <div className={isDisabled ? 'disabled-date' : ''}>
  //       {date.getDate()}
  //     </div>
  //   );
  // };

  const formatToISO8601 = (date, time) => {
    const [hours, minutes, period] = time.split(/:| /);
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const newDate = new Date(date);
    newDate.setHours(hour, parseInt(minutes), 0, 0);
    return newDate.toISOString();
  };

  //I need to call updateDiffDays whenever the pickup or return time changes:
  useEffect(() => {
    const calculateDiffDays = () => {
      if (!dateRange[0] || !dateRange[0].startDate || !dateRange[0].endDate) {
        setDiffDays(0);
        return;
      }
  
      const start = new Date(formatToISO8601(dateRange[0].startDate, pickupTime));
      const end = new Date(formatToISO8601(dateRange[0].endDate, returnTime));
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setDiffDays(0);
        return;
      }
  
      const diffTime = Math.abs(end - start);
      const calculatedDiffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setDiffDays(calculatedDiffDays);
    };
  
    calculateDiffDays();
  }, [dateRange, pickupTime, returnTime]);


  /* SUBMIT Reservation */
  const formatDateDisplay = (date, time) => {
    if (!(date instanceof Date)) return 'Select a date';
    const isoString = formatToISO8601(date, time);
    return new Date(isoString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  
  const handleSubmit = async () => {
    try {
      setIsReserving(true);  // Disable the button
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
        startDate: formatToISO8601(dateRange[0].startDate, pickupTime),
        endDate: formatToISO8601(dateRange[0].endDate, returnTime),
        totalPrice: totalPrice,
        category,
        creatorFirebaseUid,
        customerFirebaseUid,
      }; 

      console.log("Here is the Reservation form: ", reservationForm)

      const response = await fetch("http://192.168.1.66:3001/reservations/create", {
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
          const chatResponse = await fetch("http://192.168.1.66:3001/reservations/chatId", {
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
        
        toast.success("Reservation Successful!")
        navigate(`/${customerId}/reservations`);
      }
    } catch (err) {
      toast.error("Reservation failed! Try again later.")
      console.log("Submit Booking Failed.", err.message);
    }finally {
      setIsReserving(false);  // Re-enable the button
    }
  };

  /* ADD TO WISHLIST */
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);


  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user.userId) return;

      try {
        const response = await fetch(`http://192.168.1.66:3001/users/${user.userId}/wishlist/check/${listingId}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        } else {
          console.error("Failed to check wishlist status");
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [user.userId, listingId]);

  const startCooldown = () => {
    setCooldownActive(true);
    setTimeout(() => {
      setCooldownActive(false);
    }, 15000); // 15 seconds cooldown
  };


  const toggleFavorite = useCallback(debounce(async () => {
    if (!user.userId || isUpdating || cooldownActive) {
      return;
    }

    setIsUpdating(true);

    try {
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);

      const response = await fetch(
        `http://192.168.1.66:3001/users/${user.userId}/${category}/${listingId}`,
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
        toast.error("Error updating wishlist.");
        setIsFavorite(!newFavoriteState); // Revert the state if the API call fails
      } else {
        const data = await response.json();
        //toast.success("Updated WishList");
        startCooldown(); // Start the cooldown after a successful update
      }
    } catch (error) {
      console.log("Error updating wishlist:", error);
      toast.error("Error updating wishlist. Try again later.");
      setIsFavorite(!isFavorite); // Revert the state if there's an error
    } finally {
      setIsUpdating(false);
    }
  }, 300), [user.userId, listingId, category, isFavorite, isUpdating, cooldownActive, listing]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Navbar />
      <Notification/>
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
        <div className="title-container" >
          <h1>{listing.title}</h1>
          <button
          className="favorite-icon"
            onClick={toggleFavorite}
            disabled={!user.userId || isUpdating || cooldownActive}
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
            disabledDates={disabledDates}
            //dayContentRenderer={dayContentRenderer}
            selectsRange={true}
            showSelectionPreview={true}
            months={1}
            direction="horizontal"
            moveRangeOnFirstSelection={false}
            preventSnapRefocus={true}
            calendarFocus="backwards"
          />
          </div>

          {/* Pickup and Return Time container */}
          <div className="time-picker-container">
            <div className="time-picker">
              <label className="time-label">Pickup Time</label>
              <div className="time-select-wrapper">
                <select
                  className="time-select"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
                <div className="time-icon">
                  <i className="far fa-clock"></i>
                </div>
              </div>
            </div>
            <div className="time-picker">
              <label className="time-label">Return Time</label>
              <div className="time-select-wrapper">
                <select
                  className="time-select"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
                <div className="time-icon">
                  <i className="far fa-clock"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing information */}
          <div className="pricing-card">
            <div className="pricing-header">
              <h2 className="pricing-title">Booking Summary</h2>
            </div>
            <div className="pricing-details">
              <div className="pricing-row">
                <span className="pricing-label">Daily Rate:</span>
                <span className="pricing-value">${listing.price}</span>
              </div>
              <div className="pricing-row">
                <span className="pricing-label">Duration:</span>
                <span className="pricing-value">{diffDays} day{diffDays > 1 ? 's' : ''}</span>
              </div>
              <div className="pricing-row total">
                <span className="pricing-label">Total Price:</span>
                <span className="pricing-value">${listing.price * (diffDays || 1)}</span>
              </div>
            </div>
            <div className="booking-dates">
              <div className="date-row">
                <i className="fas fa-calendar-check"></i>
                <span className="date-label">From:</span>
                <span className="date-value">
                  {dateRange[0] && dateRange[0].startDate instanceof Date 
                    ? formatDateDisplay(dateRange[0].startDate, pickupTime)
                    : 'Select a start date'}
                </span>
              </div>
              <div className="date-row">
                <i className="fas fa-calendar-times"></i>
                <span className="date-label">Until:</span>
                <span className="date-value">
                  {dateRange[0] && dateRange[0].endDate instanceof Date 
                    ? formatDateDisplay(dateRange[0].endDate, returnTime)
                    : 'Select an end date'}
                </span>
              </div>
            </div>
          </div>

          {/* Reserve button container */}
          <div className="reserve-button-container">
            <button 
              className="button" 
              type="submit" 
              onClick={handleSubmit}
              disabled={isReserving}
            >
              {isReserving ? 'Reserving...' : 'Reserve'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingDetails;
