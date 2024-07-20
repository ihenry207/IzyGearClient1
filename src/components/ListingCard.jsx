import React, { useState, useRef, useEffect, useCallback  } from "react";
import "../styles/listingcard.css";
import { ArrowForwardIos, ArrowBackIosNew, Favorite } from "@mui/icons-material";
import { truncateText } from "./utils";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";
import parseAddress from "parse-address";
import Notification from '../components/notification/notification.jsx';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

const parseCustomAddress = (address) => {
  const parts = address.split(', ');
  return {
    city: parts.length > 2 ? parts[parts.length - 3] : 'N/A',
    state: parts.length > 1 ? parts[parts.length - 2].split(' ')[0] : 'N/A',
    country: parts[parts.length - 1] || 'N/A'
  };
};

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  address,
  category,
  condition,
  title,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  // const truncatedTitle = truncateText(title, 30);
  
  let city, state, country;
  if (address && address !== "N/A") {
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
    city = "";
    state = "";
    country = "";
  }

  let truncatedTitle;
  if (address && address !== "N/A") {
    if (city === 'N/A' && state === 'N/A') {
      truncatedTitle = truncateText(country, 30);
    } else if (city === 'N/A') {
      truncatedTitle = truncateText(`${state}, ${country}`, 30);
    } else if (state === 'N/A') {
      truncatedTitle = truncateText(`${city}, ${country}`, 30);
    } else {
      truncatedTitle = truncateText(`${city}, ${state}, ${country}`, 30);
    }
  } else {
    truncatedTitle = truncateText(title, 30);
  }
  
  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      goToNextSlide();
    }

    if (touchStart - touchEnd < -50) {
      goToPrevSlide();
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ADD TO WISHLIST */
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];
  const isLiked = wishList?.find((item) => item?._id === listingId);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(isLiked !== undefined);
  }, [isLiked]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    try {
      setIsFavorite(!isFavorite);
      const response = await fetch(
        `http://192.175.1.221:3001/users/${user?.userId}/${category}/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ listing: null })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message);
        toast.error("Error Adding to wishList.")
      }else if(response.ok){
        const data = await response.json();
        //console.log("Updated wishList:", data.wishList);
        toast.success("Updated WishList")
        dispatch(setWishList(data.wishList));
      }

    } catch (error) {
      console.log("Error updating wishlist:", error);
      toast.error("Error Adding to wishList. Try Later")
      //setErrorMessage("Error updating wishlist");
    }
  };

  return (
    <>
    <Notification/>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button className="close-button" onClick={() => setErrorMessage("")}>
            ✖
          </button>
        </div>
      )}

      <div className="listing-card-container">
        <div className="listing-card-image-container">
          <div
            className="listing-card-slider"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {listingPhotoPaths && listingPhotoPaths.map((photo, index) => (
            <div
              key={index}
              className={`listing-card-slide ${
                index === currentIndex ? "active" : ""
              }`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              <img src={photo} alt={`${title} photo ${index + 1}`} />
            </div>
          ))}
          </div>
          {listingPhotoPaths && listingPhotoPaths.length > 1 && (
            <>
              <div className="listing-card-arrow prev" onClick={goToPrevSlide}>
                <ArrowBackIosNew />
              </div>
              <div className="listing-card-arrow next" onClick={goToNextSlide}>
                <ArrowForwardIos />
              </div>
            </>
          )}
          <button
            className="listing-card-favorite"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            disabled={!user}
          >
            <Favorite sx={{ color: isFavorite ? "red" : "white" }} />
          </button>
        </div>
        <div
          className="listing-card-content"
          onClick={() => {
            navigate(`/gears/listingdetail`, { state: { category, listingId } });
          }}
        >
          {/* this is the tittle/name of gear */}
          <h3 className="listing-card-title">
             {truncateText(title, 30)}
          </h3>
          {/* this is the address */}
          <p className="listing-card-description">{truncatedTitle}</p>
          {!booking ? (
            <>
              <p className="listing-card-details">{condition}</p>
              <p className="listing-card-price">
                <span>${price}</span> per day
              </p>
            </>
          ) : (
            <>
              <p className="listing-card-details">
                {startDate} - {endDate}
              </p>
              <p className="listing-card-price">
                <span>${totalPrice}</span> total
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ListingCard;