import { useState, useRef } from "react";
import "../styles/listingcard.css";
import { truncateText } from "./utils";
import { ArrowForwardIos, ArrowBackIosNew, Favorite } from "@mui/icons-material";
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
  /* SLIDER FOR IMAGES */
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

  const patchWishList = async () => {
    if (user?._id !== creator._id) {
      try {
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
          throw new Error(errorData.message);
        }
  
        const data = await response.json();
        console.log("Updated wishList:", data.wishList);
        dispatch(setWishList(data.wishList));
        setErrorMessage("");
      } catch (error) {
        console.log("Error updating wishlist:", error);
        //setErrorMessage(error.message);
      }
    } else {
      setErrorMessage("Error! You can't like your own gear.");
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
      <div
        className="listing-card"
        onClick={() => {
          navigate(`/gears/${listingId}`, { state: { category } });
        }}
      >
        <div
          className="slider-container"
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {listingPhotoPaths.length > 0 ? (
            <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {listingPhotoPaths.map((photo, index) => (
                <div key={index} className="slide">
                  <img src={photo} alt={`photo ${index + 1}`} />
                  {listingPhotoPaths.length > 1 && (
                    <>
                      <div className="prev-button" onClick={(e) => { e.stopPropagation(); goToPrevSlide(e); }}>
                        <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                      </div>
                      <div className="next-button" onClick={(e) => { e.stopPropagation(); goToNextSlide(e); }}>
                        <ArrowForwardIos sx={{ fontSize: "15px" }} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-image">
              <p>No images available</p>
            </div>
          )}
        </div>
        <h3>{city}, {state}, {country}</h3>
        <p>{truncatedTitle}</p>
        {!booking ? (
          <>
            <p>Condition: {condition}</p>
            <p>
              <span>${price}</span> per day
            </p>
          </>
        ) : (
          <>
            <p>
              {startDate} - {endDate}
            </p>
            <p>
              <span>${totalPrice}</span> total
            </p>
          </>
        )}
        <button
          className="favorite"
          onClick={(e) => {
            e.stopPropagation();
            patchWishList();
          }}
          disabled={!user}
        >
          {isLiked ? <Favorite sx={{ color: "red" }} /> : <Favorite sx={{ color: "white" }} />}
        </button>
      </div>
    </>
  );
};

export default ListingCard;
