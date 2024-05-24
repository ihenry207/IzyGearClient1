//I would add this component either at the home page or somewhere else
import { useEffect, useState } from "react";
import "../styles/listing.css";
import ListingCard from "./ListingCard";
import Loader from "./loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
//import { useParams } from "react-router-dom";

const Listings = ({ pcategory, selectedFilters }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const listings = useSelector((state) => state.listings);
    console.log("Here is pcat: ", selectedFilters)
    
    const getFeedListings = async () => {
      try {
        const baseUrl = "http://10.1.82.57:3001/gears";
        let response;
        let listings = [];
    
        if (selectedFilters) {
          const {
            category,
            brand,
            gender,
            size,
            condition,
            price,
            type,
            kind,
            subcategory,
            name,
          } = selectedFilters;
    
          const filterParams = new URLSearchParams();
    
          if (category) filterParams.append("category", category);
          if (brand) filterParams.append("brand", brand);
          if (gender) filterParams.append("gender", gender);
          if (size) filterParams.append("size", size);
          if (condition) filterParams.append("condition", condition);
          if (price) filterParams.append("price", price);
          if (type) filterParams.append("type", type);
          if (kind) filterParams.append("kind", kind);
          if (subcategory) filterParams.append("subcategory", subcategory);
          if (name) filterParams.append("name", name);

          console.log("Here is the filter params",filterParams)
    
          if (category === "all" || category === "") {
            const [skiSnowResponse, bikingResponse, campingResponse] = await Promise.all([
              fetch(`${baseUrl}/skisnow`, { method: "GET" }),
              fetch(`${baseUrl}/biking`, { method: "GET" }),
              fetch(`${baseUrl}/camping`, { method: "GET" }),
            ]);
    
            if (!skiSnowResponse.ok || !bikingResponse.ok || !campingResponse.ok) {
              throw new Error("Failed to fetch listings");
            }
    
            const skiSnowListings = await skiSnowResponse.json();
            const bikingListings = await bikingResponse.json();
            const campingListings = await campingResponse.json();
    
            listings = [...skiSnowListings, ...bikingListings, ...campingListings];
          }
    
          if (category === "Camping") {
            
            const url = `${baseUrl}/camping?${filterParams.toString()}`;
            console.log("we are in camping url", url)
            response = await fetch(url, { method: "GET" });
            listings = await response.json();
          }
    
          if (category === "Biking") {
            
            const url = `${baseUrl}/biking?${filterParams.toString()}`;
            console.log("we are in biking url: ", url)
            response = await fetch(url, { method: "GET" });
            listings = await response.json();
          }
    
          if (category === "Ski" || category === "Snowboard") {
            const url = `${baseUrl}/skisnow?${filterParams.toString()}`;
            console.log("we are in ski or snowboard url: ", url)
            response = await fetch(url, { method: "GET" });
            listings = await response.json();
          }
        } else {
          const [skiSnowResponse, bikingResponse, campingResponse] = await Promise.all([
            fetch(`${baseUrl}/skisnow`, { method: "GET" }),
            fetch(`${baseUrl}/biking`, { method: "GET" }),
            fetch(`${baseUrl}/camping`, { method: "GET" }),
          ]);
    
          if (!skiSnowResponse.ok || !bikingResponse.ok || !campingResponse.ok) {
            throw new Error("Failed to fetch listings");
          }
    
          const skiSnowListings = await skiSnowResponse.json();
          const bikingListings = await bikingResponse.json();
          const campingListings = await campingResponse.json();
    
          listings = [...skiSnowListings, ...bikingListings, ...campingListings];
        }
    
        dispatch(setListings({ listings }));
        console.log("Here are some listings: ",listings);
        setLoading(false);
      } catch (err) {
        console.log("Fetch Listings Failed:", err.message);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      getFeedListings();
    }, [pcategory, selectedFilters]);
  
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
                address,
                title,
                category,
                type,
                price,
                condition,
                booking = false,
              }) => (
                <ListingCard
                  key={_id}
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  address={address}
                  condition={condition}
                  category={category}
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