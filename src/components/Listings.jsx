import { useEffect, useState } from "react";
import "../styles/listing.css";
import ListingCard from "./ListingCard";
import Loading from "./loader";

const Listings = ({ selectedFilters }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [listings, setListings] = useState([]);
    
    const getFeedListings = async () => {
      try {
        setError(null);
        setLoading(true);
        const baseUrl = "http://192.168.1.66:3001/gears";
        let response;
        let fetchedListings = [];
    
        if (selectedFilters) {
          const {
            location,
            startDate,
            endDate,
            distance,
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
            equipment,  // Add this for water gear
          } = selectedFilters;
    
          const filterParams = new URLSearchParams();
          
          if (startDate) filterParams.append("startDate", startDate);
          if (endDate) filterParams.append("endDate", endDate);
          if (category && category !== "all" && category !== "") filterParams.append("category", category);
          if (brand) filterParams.append("brand", brand);
          if (gender) filterParams.append("gender", gender);
          if (size) filterParams.append("size", size);
          if (condition) filterParams.append("condition", condition);
          if (price) filterParams.append("price", price);
          if (type) filterParams.append("type", type);
          if (kind) filterParams.append("kind", kind);
          if (subcategory) filterParams.append("subcategory", subcategory);
          if (name) filterParams.append("name", name);
          if (equipment) filterParams.append("equipment", equipment);  // Add this for water gear
          if (location && distance) {
            filterParams.append("location", location);
            filterParams.append("distance", distance);
          }
    
          if (category === "all" || category === "") {
            const [skiSnowResponse, bikingResponse, campingResponse, waterResponse] = await Promise.all([
              fetch(`${baseUrl}/skisnow?${filterParams.toString()}`, { method: "GET" }),
              fetch(`${baseUrl}/biking?${filterParams.toString()}`, { method: "GET" }),
              fetch(`${baseUrl}/camping?${filterParams.toString()}`, { method: "GET" }),
              fetch(`${baseUrl}/water?${filterParams.toString()}`, { method: "GET" }),
            ]);
    
            if (!skiSnowResponse.ok || !bikingResponse.ok || !campingResponse.ok || !waterResponse.ok) {
              throw new Error("Failed to fetch listings");
            }
    
            const skiSnowListings = await skiSnowResponse.json();
            const bikingListings = await bikingResponse.json();
            const campingListings = await campingResponse.json();
            const waterListings = await waterResponse.json();
    
            fetchedListings = [...skiSnowListings, ...bikingListings, ...campingListings, ...waterListings];
          } else if (category === "Camping") {
            response = await fetch(`${baseUrl}/camping?${filterParams.toString()}`, { method: "GET" });
            fetchedListings = await response.json();
          } else if (category === "Biking") {
            response = await fetch(`${baseUrl}/biking?${filterParams.toString()}`, { method: "GET" });
            fetchedListings = await response.json();
          } else if (category === "Ski" || category === "Snowboard") {
            response = await fetch(`${baseUrl}/skisnow?${filterParams.toString()}`, { method: "GET" });
            fetchedListings = await response.json();
          } else if (category === "Water") {
            response = await fetch(`${baseUrl}/water?${filterParams.toString()}`, { method: "GET" });
            fetchedListings = await response.json();
          }
        } else {
          const [skiSnowResponse, bikingResponse, campingResponse, waterResponse] = await Promise.all([
            fetch(`${baseUrl}/skisnow`, { method: "GET" }),
            fetch(`${baseUrl}/biking`, { method: "GET" }),
            fetch(`${baseUrl}/camping`, { method: "GET" }),
            fetch(`${baseUrl}/water`, { method: "GET" }),
          ]);
    
          if (!skiSnowResponse.ok || !bikingResponse.ok || !campingResponse.ok || !waterResponse.ok) {
            throw new Error("Failed to fetch listings");
          }
    
          const skiSnowListings = await skiSnowResponse.json();
          const bikingListings = await bikingResponse.json();
          const campingListings = await campingResponse.json();
          const waterListings = await waterResponse.json();
    
          fetchedListings = [...skiSnowListings, ...bikingListings, ...campingListings, ...waterListings];
        }
    
        setListings(fetchedListings);
        console.log("Fetched listings:", fetchedListings);
      } catch (err) {
        console.log("Fetch Listings Failed:", err.message);
        setError("Failed to fetch listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      getFeedListings();
    }, [selectedFilters]);
  
    if (loading) return <Loading />;
    if (error) return <div className="error-message">{error}</div>;

    return (
      <div className="listings-grid">
        {listings
          .filter((listing) => listing && listing._id)
          .map(({
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
            equipment,  // Add this for water gear
          }) => (
            <div className="listing-item" key={_id}>
              <ListingCard
                listingId={_id}
                creator={creator}
                listingPhotoPaths={listingPhotoPaths || []}
                address={address}
                condition={condition}
                category={category}
                title={title}
                type={type}
                price={price}
                booking={booking}
                equipment={equipment}  // Add this for water gear
              />
            </div>
          ))}
      </div>
    );
};

export default Listings;