//I would add this component either at the home page or somewhere else
import { useEffect, useState } from "react";
import "../styles/listing.css";
import ListingCard from "./ListingCard";
import Loader from "./loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
//import { useParams } from "react-router-dom";

const Listings = ({ category }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const listings = useSelector((state) => state.listings);
  
    const getFeedListings = async () => {
      try {
        let response;
        let listings = [];
  
        if (category === "biking") {
          response = await fetch("http://10.1.82.57:3001/gears/biking", {
            method: "GET",
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.log("Error fetching biking listings:", errorData.error);
            throw new Error("Failed to fetch biking listings");
          }
          listings = await response.json();
        } else if (category === "skiing") {
            response = await fetch("http://10.1.82.57:3001/gears/skisnow?category=Ski", {
              method: "GET",
            });
            if (!response.ok) {
              const errorData = await response.json();
              console.log("Error fetching skiing listings:", errorData.error);
              throw new Error("Failed to fetch skiing listings");
            }
            listings = await response.json();
          } else if (category === "snowboarding") {
            response = await fetch("http://10.1.82.57:3001/gears/skisnow?category=Snowboard", {
              method: "GET",
            });
            if (!response.ok) {
              const errorData = await response.json();
              console.log("Error fetching snowboarding listings:", errorData.error);
              throw new Error("Failed to fetch snowboarding listings");
            }
            listings = await response.json();
        } else if (category === "camping") {
          response = await fetch("http://10.1.82.57:3001/gears/camping", {
            method: "GET",
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.log("Error fetching camping listings:", errorData.error);
            throw new Error("Failed to fetch camping listings");
          }
          listings = await response.json();
        } else if (category === "all") {
          const [skiSnowResponse, bikingResponse, campingResponse] = await Promise.all([
            fetch("http://10.1.82.57:3001/gears/skisnow", { method: "GET" }),
            fetch("http://10.1.82.57:3001/gears/biking", { method: "GET" }),
            fetch("http://10.1.82.57:3001/gears/camping", { method: "GET" }),
          ]);
  
          if (!skiSnowResponse.ok) {
            const errorData = await skiSnowResponse.json();
            console.log("Error fetching ski/snowboarding listings:", errorData.error);
            throw new Error("Failed to fetch ski/snowboarding listings");
          }
          if (!bikingResponse.ok) {
            const errorData = await bikingResponse.json();
            console.log("Error fetching biking listings:", errorData.error);
            throw new Error("Failed to fetch biking listings");
          }
          if (!campingResponse.ok) {
            const errorData = await campingResponse.json();
            console.log("Error fetching camping listings:", errorData.error);
            throw new Error("Failed to fetch camping listings");
          }
  
          const skiSnowListings = await skiSnowResponse.json();
          const bikingListings = await bikingResponse.json();
          const campingListings = await campingResponse.json();
  
          listings = [...skiSnowListings, ...bikingListings, ...campingListings];
        } else {
          console.log("Invalid or missing category");
          setLoading(false);
          return;
        }
  
        dispatch(setListings({ listings }));
        setLoading(false);
      } catch (err) {
        console.log("Fetch Listings Failed:", err.message);
        setLoading(false);
        // You can display an error message to the user or handle the error in any other way
      }
    };
  
    useEffect(() => {
      getFeedListings();
    }, [category]);
  
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <div className="listings">
            {listings.map(
              ({
                _id,
                creator,
                listingPhotoPaths,
                city,
                state,
                country,
                title,
                type,
                price,
                booking = false,
              }) => (
                <ListingCard
                  key={_id}
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  city={city}
                  state={state}
                  country={country}
                  title={title}
                  type={type}
                  price={price}
                  booking={booking}
                />
              )
            )}
          </div>
        )}
      </>
    );
  };
  
  export default Listings;