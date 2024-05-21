import React, { useState, useRef, useEffect } from "react";
import "../styles/listingcard.css";
import { ArrowForwardIos, ArrowBackIosNew, Favorite } from "@mui/icons-material";
import { truncateText } from "./utils";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  state,
  country,
  title,
  category,
  condition,
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
  const truncatedTitle = truncateText(title, 30);

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
    try {
      setIsFavorite(!isFavorite);
      const response = await fetch(
        `http://10.1.82.57:3001/users/${user?._id}/${category}/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message);
      }

      const data = await response.json();
      console.log("Updated wishList:", data.wishList);
      dispatch(setWishList(data.wishList));
      setErrorMessage("");
    } catch (error) {
      console.log("Error updating wishlist:", error);
    }
  };

  return (
    <>
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
            {listingPhotoPaths.map((photo, index) => (
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
          {listingPhotoPaths.length > 1 && (
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
            navigate(`/gears/${listingId}`, { state: { category } });
          }}
        >
          <h3 className="listing-card-title">
            {city}, {state}, {country}
          </h3>
          <p className="listing-card-description">{truncatedTitle}</p>
          {!booking ? (
            <>
              <p className="listing-card-details">Condition: {condition}</p>
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