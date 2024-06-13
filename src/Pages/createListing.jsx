import "../styles/createListing.css";
import Navbar from "../components/Navbar";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { LoadScript, GoogleMap, Autocomplete } from "@react-google-maps/api"; //google api for address
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoImageOutline } from 'react-icons/io5';
import React, { useState, useEffect, useRef } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Loader from "../components/loader";
import { setOwnerGearList } from "../redux/state";
const libraries = ["places"]; //IoIosImages

const CreateListing = () => {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [withBoots, setWithBoots] = useState(false);
  const [withBindings, setWithBindings] = useState(false);
  const [type, setType] = useState("");
  const [kind, setKind] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [otherSubcategory, setOtherSubcategory] = useState("");
  const [name, setName] = useState("");
  const [customBrand, setCustomBrand] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const creatorId = useSelector((state) => state.user.userId);
  const ownerGearList = useSelector((state) => state.user.ownerGearList); // Ensure to get the current list
  const navigate = useNavigate();

  const [formLocation, setFormLocation] = useState({
    address: "",
  });

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };

  const handlePlaceChanged = (place) => {
    setFormLocation({
      address: place.formatted_address,
    });
  };

  /* UPLOAD, DRAG & DROP, REMOVE PHOTOS */
  const [photos, setPhotos] = useState([]);

  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
  };
  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  /* DESCRIPTION */
  const [description, setDescription] = useState("");
  //const creatorId = useSelector((state) => state.user.userId);//hopefully this won't break
  

  // const navigate = useNavigate();

  const HandlePost = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    // Check if all required fields are filled
    const missingFields = [];
    if (!category) missingFields.push("Category");
    if (!brand && brand !== 'Other') missingFields.push("Brand");
    if (brand === 'Other' && !customBrand) missingFields.push("Custom Brand");
    if (!gender) missingFields.push("Gender");
    if (!size) missingFields.push("Size");
    if (!price) missingFields.push("Price");
    if (!formLocation.address) missingFields.push("address");
    if (!condition) missingFields.push("Condition");
    if (!description) missingFields.push("Description");

    if (missingFields.length > 0) {
      console.log("missing fields", missingFields);
      setErrorMessage(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return;
    }

    setIsLoading(true); // Show the loader when the form is submitted

    try {
      /* Create a new FormData object to handle file uploads */
      const listingForm = new FormData();
      listingForm.append("creator", creatorId);
      listingForm.append("category", category);
      listingForm.append("brand", brand === 'Other' ? customBrand : brand);
      listingForm.append("gender", gender);
      listingForm.append("size", size);
      listingForm.append("price", price);
      listingForm.append("address", formLocation.address);
      listingForm.append("condition", condition);
      listingForm.append("description", description);

      if (category === "Snowboard" || category === "Ski") {
        listingForm.append("boots", withBoots);
        listingForm.append("bindings", withBindings);
      }

      if (category === "Biking") {
        listingForm.append("type", type);
        listingForm.append("kind", kind);
      }

      if (category === "Camping") {
        listingForm.append("subcategory", subcategory === "Others" ? otherSubcategory : subcategory);
        listingForm.append("name", name);
      }

      /* Append each selected photo to the FormData object */
      photos.forEach((photo) => {
        listingForm.append("listingPhotos", photo);
      });

      /* Send a POST request to server 10.1.82.57:3001*/
      const response = await fetch(
        category === "Biking" ? "http://10.1.82.57:3001/gears/biking/create" :
        category === "Camping" ? "http://10.1.82.57:3001/gears/camping/create" :
        "http://10.1.82.57:3001/gears/skisnow/create",
        {
          method: "POST",
          body: listingForm,
        }
      );

      console.log("Response: ", response);
      
      if (response.ok) {
        const newListing = await response.json();
        dispatch(setOwnerGearList([...ownerGearList, newListing]));
        setIsLoading(false);
        navigate("/");

      } else {
        const errorData = await response.json();
        setErrorMessage("Error. Try again later");
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Publish Listing failed", err.message);
      setErrorMessage("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return(
    <>
    <Navbar />
    {errorMessage && (
      <div className="error-message">
        <p>{errorMessage}</p>
        <button className="close-button" onClick={() => setErrorMessage("")}>
        ✖
        </button>
      </div>
    )}
    {isLoading && <Loader />} {/* Show the loader when isLoading is true */}
    <div className="create-listing">
    <h1 ref={topRef}>Publish Your Gear</h1>
      <form onSubmit={HandlePost}>
        <div className="create-listing_step1">
          <h2>Step 1: Tell us about your gear</h2>
          <hr />
          <h3>Which of these categories best describes your gear?</h3>
          <div className="category-list">
            <div
              className={`category ${category === "Snowboard" ? "selected" : ""}`}
              onClick={() => setCategory("Snowboard")}
            >
              <p>Snowboard</p>
            </div>
            <div
              className={`category ${category === "Ski" ? "selected" : ""}`}
              onClick={() => setCategory("Ski")}
            >
              <p>Ski</p>
            </div>
            <div
              className={`category ${category === "Biking" ? "selected" : ""}`}
              onClick={() => setCategory("Biking")}
            >
              <p>Biking</p>
            </div>
            <div
              className={`category ${category === "Camping" ? "selected" : ""}`}
              onClick={() => setCategory("Camping")}
            >
              <p>Camping</p>
            </div>
          </div>

          {category === "Snowboard" && (
            <>
              <h3>Brand</h3>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  if (e.target.value !== 'Other') {
                    setCustomBrand('');
                  }
                }}
                required
              >
                <option value="">Select a brand</option>
                <option value="Arbor">Arbor</option>
                <option value="Bataleon">Bataleon</option>
                <option value="Burton">Burton</option>
                <option value="CAPiTA">CAPiTA</option>
                <option value="Cardiff">Cardiff</option>
                <option value="DC">DC</option>
                <option value="GNU">GNU</option>
                <option value="Jones">Jones</option>
                <option value="K2">K2</option>
                <option value="Lib Tech">Lib Tech</option>
                <option value="Moss Snowstick">Moss Snowstick</option>
                <option value="Never Summer">Never Summer</option>
                <option value="Nidecker">Nidecker</option>
                <option value="Nitro">Nitro</option>
                <option value="Public Snowboards">Public Snowboards</option>
                <option value="Ride">Ride</option>
                <option value="Rome">Rome</option>
                <option value="Rossignol">Rossignol</option>
                <option value="Roxy">Roxy</option>
                <option value="Salomon">Salomon</option>
                <option value="Season">Season</option>
                <option value="Sims">Sims</option>
                <option value="Slash">Slash</option>
                <option value="United Shapes">United Shapes</option>
                <option value="Weston">Weston</option>
                <option value="WNDR Alpine">WNDR Alpine</option>
                <option value="Yes.">Yes.</option>
                <option value="Other">Other</option>
              </select>
              {brand === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter brand name"
                  maxLength={15}
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  required
                />
              )}

              <h3>Gender</h3>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="Men's">Men's</option>
                <option value="Women's">Women's</option>
                <option value="Kids'">Kids'</option>
                <option value="Boys'">Boys'</option>
                <option value="Girls'">Girls'</option>
              </select>

              <h3>Size (in CM)</h3>
              <div className="size-input">
                <input
                  type="number"
                  placeholder="Enter size"
                  min={1}
                  max={300}
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                />
                <span>cm</span>
              </div>
              <h3>Price per Day (in dollars)</h3>
              <input
                type="number"
                placeholder="Enter price"
                min={1}
                max={199.99}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <h3>Additional Options</h3>
              <div>
                <input
                  type="checkbox"
                  id="withBoots"
                  checked={withBoots}
                  onChange={(e) => setWithBoots(e.target.checked)}
                />
                <label htmlFor="withBoots">Comes with Boots</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="withBindings"
                  checked={withBindings}
                  onChange={(e) => setWithBindings(e.target.checked)}
                />
                <label htmlFor="withBindings">Comes with Bindings</label>
              </div>
            </>
          )}

          {category === "Ski" && (
            <>
              <h3>Brand</h3>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  if (e.target.value !== 'Other') {
                    setCustomBrand('');
                  }
                }}
                required
              >
                <option value="">Select a brand</option>
                <option value="4FRNT">4FRNT</option>
                <option value="Armada Skis">Armada Skis</option>
                <option value="Atomic">Atomic</option>
                <option value="Black Crows">Black Crows</option>
                <option value="Black Diamond Equipment">Black Diamond Equipment</option>
                <option value="Blizzard">Blizzard</option>
                <option value="Blossom">Blossom</option>
                <option value="DPS Skis">DPS Skis</option>
                <option value="Dynastar">Dynastar</option>
                <option value="Elan">Elan</option>
                <option value="Faction Skis">Faction Skis</option>
                <option value="Fischer">Fischer</option>
                <option value="Forest Skis">Forest Skis</option>
                <option value="Freyrie">Freyrie</option>
                <option value="Friztmeir Skis">Friztmeir Skis</option>
                <option value="Hart">Hart</option>
                <option value="Head">Head</option>
                <option value="Identity One / Id One">Identity One / Id One</option>
                <option value="J Skis">J Skis</option>
                <option value="K2">K2</option>
                <option value="Kneissl">Kneissl</option>
                <option value="Liberty Skis">Liberty Skis</option>
                <option value="Line Skis">Line Skis</option>
                <option value="Madshus">Madshus</option>
                <option value="Moment Skis">Moment Skis</option>
                <option value="Nordica">Nordica</option>
                <option value="Ogasaka Skis">Ogasaka Skis</option>
                <option value="Olin">Olin</option>
                <option value="Paradise Skis">Paradise Skis</option>
                <option value="Peltonen">Peltonen</option>
                <option value="Romp Skis">Romp Skis</option>
                <option value="Rønning Treski">Rønning Treski</option>
                <option value="Rossignol">Rossignol</option>
                <option value="Salomon">Salomon</option>
                <option value="Slatnar">Slatnar</option>
                <option value="Spalding Skis">Spalding Skis</option>
                <option value="Stöckli">Stöckli</option>
                <option value="Voit">Voit</option>
                <option value="Volant">Volant</option>
                <option value="Völkl">Völkl</option>
                <option value="Other">Other</option>
              </select>
              {brand === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter brand name"
                  maxLength={15}
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  required
                />
              )}

              <h3>Gender</h3>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="Men's">Men's</option>
                <option value="Women's">Women's</option>
                <option value="Kids'">Kids'</option>
                <option value="Boys'">Boys'</option>
                <option value="Girls'">Girls'</option>
              </select>

              <h3>Size (in CM)</h3>
              <div className="size-input">
                <input
                  type="number"
                  placeholder="Enter size"
                  min={1}
                  max={300}
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                />
                <span>cm</span>
              </div>
              <h3>Price per Day (in dollars)</h3>
              <input
                type="number"
                placeholder="Enter price"
                min={1}
                max={199.99}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

                <h3>Additional Options</h3>
                    <div>
                      <input
                        type="checkbox"
                        id="withBoots"
                        checked={withBoots}
                        onChange={(e) => setWithBoots(e.target.checked)}
                      />
                      <label htmlFor="withBoots">Comes with Boots</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="withBindings"
                        checked={withBindings}
                        onChange={(e) => setWithBindings(e.target.checked)}
                      />
                      <label htmlFor="withBindings">Comes with Bindings</label>
                    </div>
            </>
          )}

          {category === "Biking" && (
            <>
            <h3>Type</h3>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select a type</option>
                <option value="scooter">Scooter</option>
                <option value="bike">Bike</option>
              </select>

              <h3>Kind</h3>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                required
              >
                <option value="">Select a kind</option>
                <option value="electric">Electric</option>
                <option value="non-electric">Non-electric</option>
              </select>
              <h3>Brand</h3>
              <input
                type="text"
                placeholder="Enter brand name"
                maxLength={25}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                style={{ width: "60%" }}
              />
              {brand === "Other" && (
                <input
                  type="text"
                  placeholder="Enter brand name"
                  maxLength={15}
                  required
                />
              )}

              <h3>Gender</h3>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="Men's">Men's</option>
                <option value="Women's">Women's</option>
                <option value="Kids'">Kids'</option>
                <option value="Boys'">Boys'</option>
                <option value="Girls'">Girls'</option>
              </select>

              <h3>Size</h3>
                <input
                  type="text"
                  placeholder="Enter size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                />


              <h3>Price per Day (in dollars)</h3>
              <input
                type="number"
                placeholder="Enter price"
                min={1}
                max={199.99}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </>
          )}

          {category === "Camping" && (
            <>
              <h3>Subcategory</h3>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                required
              >
                <option value="">Select a subcategory</option>
                <option value="Sleeping bags and pads">Sleeping bags and pads</option>
                <option value="Tents and shelter">Tents and shelter</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Lighting">Lighting</option>
                <option value="Furniture">Furniture</option>
                <option value="Bags and backpacks">Bags and backpacks</option>
                <option value="Outdoor clothing">Outdoor clothing</option>
                <option value="Portable power">Portable power</option>
                <option value="Others">Others</option>
              </select>

              {subcategory === "Others" && (
                <input
                  type="text"
                  placeholder="Specify subcategory"
                  value={otherSubcategory}
                  onChange={(e) => setOtherSubcategory(e.target.value)}
                  required
                />
              )}

              <h3>Brand</h3>
              <input
                type="text"
                placeholder="Enter brand name"
                maxLength={25}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                style={{ width: "60%" }}
              />

              <h3>Name</h3>
              <input
                type="text"
                placeholder="Enter item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <h3>Gender</h3>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Men's">Men's</option>
                  <option value="Women's">Women's</option>
                  <option value="Kids'">Kids'</option>
                  <option value="Boys'">Boys'</option>
                  <option value="Girls'">Girls'</option>
                  <option value="No gender">No gender</option>
                </select>

                <h3>Size</h3>
                <input
                  type="text"
                  placeholder="Enter size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                />

              <h3>Price per Day (in dollars)</h3>
              <input
                type="number"
                placeholder="Enter price"
                min={1}
                max={599.99}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </>
          )}

      <div className="create-listing">
        <h3>Where's your gear located?</h3>
        <p style={{ fontSize: "18px", fontWeight: "normal" }}>
          Your address is only shared with renters after they've made a reservation.
        </p>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <Autocomplete
            onLoad={(autocomplete) => {
              autocomplete.setFields(["formatted_address"]);
              autocomplete.addListener("place_changed", () => {
                handlePlaceChanged(autocomplete.getPlace());
              });
            }}
          >
            <input
              type="text"
              placeholder="Enter your address"
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              name="address"
              value={formLocation.address}
              onChange={handleChangeLocation}
              required
            />
          </Autocomplete>
        </LoadScript>
      </div>

         

          <h3>Condition</h3>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          >
            <option value="">Select condition</option>
            <option value="Looks like new">Looks like new</option>
            <option value="Very good">Very good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>

          
        </div>

        <div className="create-listing_step2">
          <h2>Step 2: Make your gear stand out</h2>
          <hr />

          <h3>Description</h3>
          <textarea
            placeholder="Enter a description of your gear"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <h3>Add some photos of your gear</h3>
          <DragDropContext onDragEnd={handleDragPhoto}>
            <Droppable droppableId="photos" direction="horizontal">
              {(provided) => (
                <div
                  className="photos"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {photos.length < 1 && (
                    <>
                      <input
                        id="image"
                        type="file"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleUploadPhotos}
                        multiple
                      />
                      <label htmlFor="image" className="alone">
                        <div className="icon">
                          <IoImageOutline />
                        </div>
                        <p>Upload from your device</p>
                      </label>
                    </>
                  )}

                  {photos.length >= 1 && (
                    <>
                      {photos.map((photo, index) => (
                        <Draggable
                          key={index}
                          draggableId={index.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="photo"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <img src={URL.createObjectURL(photo)} alt="gear" />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                              >
                                <BiTrash />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      <input
                        id="image"
                        type="file"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleUploadPhotos}
                        multiple
                      />
                      <label htmlFor="image" className="together">
                        <div className="icon">
                          <IoImageOutline />
                        </div>
                        <p>Upload from your device</p>
                      </label>
                    </>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <button
        className="submit_btn"
        type="submit"
        disabled={isLoading} // Disable the button while loading
      >
        {isLoading ? "Publishing..." : "Publish Your Gear"} {/* Update button text based on loading state */}
      </button>
      </form>
    </div>

    <Footer />
  </>
  );
}
export default CreateListing;
