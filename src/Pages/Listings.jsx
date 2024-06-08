import "../styles/List.css";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/footer";

const Listings = () => {
  const ownerGearList = useSelector((state) => state.ownerGearList);

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {ownerGearList?.map(
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
      <Footer />
    </>
  );
};

export default Listings;