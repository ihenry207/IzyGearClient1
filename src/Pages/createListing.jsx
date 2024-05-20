import "../styles/createListing.css";
import Navbar from "../components/Navbar";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { LoadScript, GoogleMap, Autocomplete } from "@react-google-maps/api";//google api for address
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoImageOutline } from 'react-icons/io5';
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import loader from "../components/loader";
const libraries = ["places"];
//IoIosImages
const CreateListing = () =>{
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
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  /* LOCATION */
  const [formLocation, setFormLocation] = useState({
    country: "",
    state: "",
    city: "",
    zip: "",
    streetAddress: "",
    aptSuite: "",
  });
  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };
  const handlePlaceChanged = (place) => {
    const addressComponents = place.address_components;
    const getComponent = (type) =>
      addressComponents.find((component) => component.types.includes(type))?.long_name || "";

    setFormLocation({
      country: getComponent("country"),
      state: getComponent("administrative_area_level_1"),
      city: getComponent("locality"),
      zip: getComponent("postal_code"),
      streetAddress:  getComponent("street_number")+ " " + getComponent("route"),
      aptSuite: "", // This will still need to be manually entered
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

  const creatorId = useSelector((state) => state.user._id);

  const navigate = useNavigate();

  const handlePost = async (e) => {
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
    if (!formLocation.country) missingFields.push("Country");
    if (!formLocation.state) missingFields.push("State");
    if (!formLocation.city) missingFields.push("City");
    if (!formLocation.zip) missingFields.push("Zip Code");
    if (!formLocation.streetAddress) missingFields.push("Street Address");
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
      listingForm.append("country", formLocation.country);
      listingForm.append("state", formLocation.state);
      listingForm.append("city", formLocation.city);
      listingForm.append("zip", formLocation.zip);
      listingForm.append("streetAddress", formLocation.streetAddress);
      listingForm.append("aptSuite", formLocation.aptSuite);
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
        category === "Biking"
          ? "http://10.1.82.57:3001/gears/biking/create"
          : category === "Camping"
          ? "http://10.1.82.57:3001/gears/camping/create"
          : "http://10.1.82.57:3001/gears/skisnow/create",
        {
          method: "POST",
          body: listingForm,
        }
      );
      console.log("Response:", response);
  
      if (response.ok) {
        setIsLoading(false);
        navigate("/");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (err) {
      console.log("Publish Listing failed", err.message);
      setErrorMessage("An error occurred. Please try again.");
    }
    
  };
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
    {isLoading && <loader />} {/* Show the loader when isLoading is true */}
    <div className="create-listing">
      <h1>Publish Your Gear</h1>
      <form onSubmit={handlePost}>
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
                <option value="Armada">Armada</option>
                <option value="Atomic">Atomic</option>
                <option value="Black Crows">Black Crows</option>
                <option value="Black Diamond">Black Diamond</option>
                <option value="Blizzard">Blizzard</option>
                <option value="CANDIDE">CANDIDE</option>
                <option value="Coalition Snow">Coalition Snow</option>
                <option value="DPS">DPS</option>
                <option value="Dynafit">Dynafit</option>
                <option value="Dynastar">Dynastar</option>
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

        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
          <Autocomplete
            onLoad={(autocomplete) => {
              autocomplete.setFields(["address_components"]);
              autocomplete.addListener("place_changed", () => {
                handlePlaceChanged(autocomplete.getPlace());
              });
            }}
          >
            <input
              type="text"
              placeholder="Enter your address"
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
          </Autocomplete>
        </LoadScript>

        <div className="full">
          <div className="location">
            <p>Country</p>
            <input
              type="text"
              placeholder="Country"
              name="country"
              value={formLocation.country}
              onChange={handleChangeLocation}
              required
            />
          </div>
        </div>

        <div className="half">
          <div className="location">
            <p>State</p>
            <input
              type="text"
              placeholder="State"
              name="state"
              value={formLocation.state}
              onChange={handleChangeLocation}
              required
            />
          </div>
          <div className="location">
            <p>City</p>
            <input
              type="text"
              placeholder="City"
              name="city"
              value={formLocation.city}
              onChange={handleChangeLocation}
              required
            />
          </div>
        </div>

        <div className="half">
          <div className="location">
            <p>Zip Code</p>
            <input
              type="text"
              placeholder="Zip Code"
              name="zip"
              value={formLocation.zip}
              onChange={handleChangeLocation}
            />
          </div>
          <div className="location">
            <p>Street Address</p>
            <input
              type="text"
              placeholder="Street Address"
              name="streetAddress"
              value={formLocation.streetAddress}
              onChange={handleChangeLocation}
              required
            />
          </div>
        </div>

        <div className="full">
          <div className="location">
            <p>Apartment, Suite, etc. (if applicable)</p>
            <input
              type="text"
              placeholder="Apt, Suite, etc. (if applicable)"
              name="aptSuite"
              value={formLocation.aptSuite}
              onChange={handleChangeLocation}
            />
          </div>
        </div>
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
                      {photos.map((photo, index) => {
                        return (
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
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt="gear"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(index)}
                                >
                                  <BiTrash />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
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

          {/* <h3>Description</h3>
          <textarea
            placeholder="Enter a description of your gear"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea> */}
        </div>

        <button className="submit_btn" type="submit">
          PUBLISH YOUR GEAR
        </button>
      </form>
    </div>

    <Footer />
  </>
  );
}
export default CreateListing;
