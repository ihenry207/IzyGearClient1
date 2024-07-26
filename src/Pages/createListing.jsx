import "../styles/createListing.css";
import Navbar from "../components/Navbar";
import { IoImageOutline } from 'react-icons/io5';
import React, { useState, useEffect, useRef } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Loading from "../components/loader";
//import { setOwnerGearList } from "../redux/state";
import { Loader } from '@googlemaps/js-api-loader';
import ImageUploading from 'react-images-uploading';

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
  //const ownerGearList = useSelector((state) => state.user.ownerGearList); // Ensure to get the current list
  const firebaseUid = useSelector(state => state.firebaseUid || '');
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);

  const [formLocation, setFormLocation] = useState({
    address: "",
  });

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries,
    });

    loader.load().then(() => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("autocomplete"),
        {
          fields: ["formatted_address"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        handlePlaceChanged(autocomplete.getPlace());
      });

      autocompleteRef.current = autocomplete;
    });
  }, []);

  

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
  const maxNumber = 20;
  const acceptedFileTypes = ["jpg", "gif", "png", "jpeg", "webp"];

  const onChange = (imageList, addUpdateIndex) => {
    setPhotos(imageList);
  };

  const onError = (errors, files) => {
    if(errors.maxNumber) {
      alert(`Number of selected images exceed ${maxNumber}`);
    }
    if(errors.acceptType) {
      alert(`Please upload only the following image types: ${acceptedFileTypes.join(', ')}`);
    }
  };



  /* DESCRIPTION */
  const [description, setDescription] = useState("");
  //const creatorId = useSelector((state) => state.user.userId);//hopefully this won't break
  


  const HandlePost = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    // Check if all required fields are filled
    const missingFields = [];
    if (!category) missingFields.push("Category");
    if (!brand) missingFields.push("Brand");
    if (!price) missingFields.push("Price");
    if (!formLocation.address) missingFields.push("address");
    if (!condition) missingFields.push("Condition");
    if (!description) missingFields.push("Description");
  
    // Category-specific checks
    if (category === "Biking") {
      if (!type) missingFields.push("Type");
      if (!kind) missingFields.push("Kind");
      if (!size) missingFields.push("Size");
    } else if (category === "Camping") {
      if (!subcategory) missingFields.push("Subcategory");
      if (!size) missingFields.push("Size");
      if ((subcategory === "Sleeping bags" || subcategory === "Outdoor clothing") && !gender) {
        missingFields.push("Gender");
      }
    } else {
      // For Snowboard and Ski categories
      if (!gender) missingFields.push("Gender");
      if (!size) missingFields.push("Size");
    }
  
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
      listingForm.append("brand", brand);
      listingForm.append("price", price);
      listingForm.append("address", formLocation.address);
      listingForm.append("condition", condition);
      listingForm.append("description", description);
      listingForm.append("creatorFirebaseUid", firebaseUid);
  
      if (category === "Snowboard" || category === "Ski") {
        listingForm.append("gender", gender);
        listingForm.append("size", size);
        listingForm.append("boots", withBoots);
        listingForm.append("bindings", withBindings);
      }
  
      if (category === "Biking") {
        listingForm.append("type", type);
        listingForm.append("kind", kind);
        listingForm.append("size", size);
      }
  
      if (category === "Camping") {
        listingForm.append("subcategory", subcategory);
        listingForm.append("size", size);
        if (subcategory === "Sleeping bags" || subcategory === "Outdoor clothing") {
          listingForm.append("gender", gender);
        }
      }
  
      /* Append each selected photo to the FormData object */
      photos.forEach((photo, index) => {
        // Convert data URL to Blob
        const blob = dataURLtoBlob(photo.data_url);
        // Create a File object
        const file = new File([blob], `photo_${index}.jpg`, { type: 'image/jpeg' });
        listingForm.append("listingPhotos", file);
      });
      
      // Helper function to convert data URL to Blob
      function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
      }
  
      /* Send a POST request to server 10.1.82.57:3001*/
      const response = await fetch(
        category === "Biking" ? "http://192.168.1.66:3001/gears/biking/create" :
        category === "Camping" ? "http://192.168.1.66:3001/gears/camping/create" :
        "http://192.168.1.66:3001/gears/skisnow/create",
        {
          method: "POST",
          body: listingForm,
        }
      );
  
      console.log("Response: ", response);
      
      if (response.ok) {
        const newListing = await response.json();
        //dispatch(setOwnerGearList([...ownerGearList, newListing]));
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
    {isLoading && <Loading />} {/* Show the loader when isLoading is true */}
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
              </select>
              

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
                
                <select name="snowboardSize"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                >
                  <option value="">Select Size</option>
                  <option value="128">128cm</option>
                  <option value="129">129cm</option>
                  <option value="130">130cm</option>
                  <option value="131">131cm</option>
                  <option value="132">132cm</option>
                  <option value="133">133cm</option>
                  <option value="134">134cm</option>
                  <option value="135">135cm</option>
                  <option value="136">136cm</option>
                  <option value="137">137cm</option>
                  <option value="138">138cm</option>
                  <option value="139">139cm</option>
                  <option value="140">140cm</option>
                  <option value="141">141cm</option>
                  <option value="142">142cm</option>
                  <option value="143">143cm</option>
                  <option value="144">144cm</option>
                  <option value="145">145cm</option>
                  <option value="146">146cm</option>
                  <option value="147">147cm</option>
                  <option value="148">148cm</option>
                  <option value="149">149cm</option>
                  <option value="150">150cm</option>
                  <option value="151">151cm</option>
                  <option value="152">152cm</option>
                  <option value="153">153cm</option>
                  <option value="154">154cm</option>
                  <option value="155">155cm</option>
                  <option value="156">156cm</option>
                  <option value="157">157cm</option>
                  <option value="158">158cm</option>
                  <option value="159">159cm</option>
                  <option value="160">160cm</option>
                  <option value="161">161cm</option>
                  <option value="162">162cm</option>
                  <option value="163">163cm</option>
                  <option value="164">164cm</option>
                  <option value="165">165cm</option>
                  <option value="166">166cm</option>
                  <option value="167">167cm</option>
              </select>

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
                {/* <option value="Other">Other</option> */}
              </select>
              

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
                
                <select name="skiSize"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                >
                  <option value="">Select Size</option>
                  <option value="115">115cm</option>
                  <option value="116">116cm</option>
                  <option value="117">117cm</option>
                  <option value="118">118cm</option>
                  <option value="119">119cm</option>
                  <option value="120">120cm</option>
                  <option value="121">121cm</option>
                  <option value="122">122cm</option>
                  <option value="123">123cm</option>
                  <option value="124">124cm</option>
                  <option value="125">125cm</option>
                  <option value="126">126cm</option>
                  <option value="127">127cm</option>
                  <option value="128">128cm</option>
                  <option value="129">129cm</option>
                  <option value="130">130cm</option>
                  <option value="131">131cm</option>
                  <option value="132">132cm</option>
                  <option value="133">133cm</option>
                  <option value="134">134cm</option>
                  <option value="135">135cm</option>
                  <option value="136">136cm</option>
                  <option value="137">137cm</option>
                  <option value="138">138cm</option>
                  <option value="139">139cm</option>
                  <option value="140">140cm</option>
                  <option value="141">141cm</option>
                  <option value="142">142cm</option>
                  <option value="143">143cm</option>
                  <option value="144">144cm</option>
                  <option value="145">145cm</option>
                  <option value="146">146cm</option>
                  <option value="147">147cm</option>
                  <option value="148">148cm</option>
                  <option value="149">149cm</option>
                  <option value="150">150cm</option>
                  <option value="151">151cm</option>
                  <option value="152">152cm</option>
                  <option value="153">153cm</option>
                  <option value="154">154cm</option>
                  <option value="155">155cm</option>
                  <option value="156">156cm</option>
                  <option value="157">157cm</option>
                  <option value="158">158cm</option>
                  <option value="159">159cm</option>
                  <option value="160">160cm</option>
                  <option value="161">161cm</option>
                  <option value="162">162cm</option>
                  <option value="163">163cm</option>
                  <option value="164">164cm</option>
                  <option value="165">165cm</option>
                  <option value="166">166cm</option>
                  <option value="167">167cm</option>
                  <option value="168">168cm</option>
                  <option value="169">169cm</option>
                  <option value="170">170cm</option>
                  <option value="171">171cm</option>
                  <option value="172">172cm</option>
                  <option value="173">173cm</option>
                  <option value="174">174cm</option>
                  <option value="175">175cm</option>
                  <option value="176">176cm</option>
                  <option value="177">177cm</option>
                  <option value="178">178cm</option>
                  <option value="179">179cm</option>
                  <option value="180">180cm</option>
                  <option value="181">181cm</option>
                  <option value="182">182cm</option>
                  <option value="183">183cm</option>
                  <option value="184">184cm</option>
                  <option value="185">185cm</option>
                  <option value="186">186cm</option>
                  <option value="187">187cm</option>
                  <option value="188">188cm</option>
                  <option value="189">189cm</option>
                  <option value="190">190cm</option>
              </select>
              
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
                <option value="Road-Bike">Road Bike</option>
                <option value="Mountain-Bike">Mountain Bike</option>
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

              {type === 'Road-Bike' && (
                <>
                  <h3>Brand</h3>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  >
                    <option value="">Select brand</option>
                    {kind === 'non-electric' ? 
                      [
                        "Trek", "Specialized", "Cannondale", "Giant", "Cervélo",
                        "Pinarello", "BMC", "Colnago", "Bianchi", "Scott",
                        "Orbea", "Wilier", "Ridley", "Factor", "Fuji",
                        "Argon 18", "Merida", "Canyon", "De Rosa", "Look",
                        "Felt", "Litespeed", "Parlee", "Santa Cruz", "Focus",
                        "Kona", "Diamondback", "Raleigh", "Kinesis", "Time"
                      ].map((brandName) => (
                        <option key={brandName} value={brandName}>{brandName}</option>
                      ))
                    : 
                      [
                        "Specialized (Turbo Creo SL)", "Trek (Domane+ series)",
                        "Cannondale (Synapse NEO)", "Giant (Road E+ series)",
                        "Bianchi (Aria E-Road, Impulso E-Road)", "Orbea (Gain series)",
                        "Pinarello (Dyodo series)", "Canyon (Endurace:ON)",
                        "Focus (Paralane²)", "Wilier (Cento1 Hybrid, Cento10 Hybrid)",
                        "BMC (Alpenchallenge AMP Road)", "Ribble (Endurance SL e)",
                        "Colnago (E64)", "Argon 18 (Subito e-road)",
                        "BH Bikes (Rebel series)", "Look (E-765 Optimum)",
                        "De Rosa (E-ROAD)", "Lapierre (eSensium series)",
                        "Merida (Scultura E-Road)", "Ridley (Kanzo E)",
                        "Fazua"
                      ].map((brandName) => (
                        <option key={brandName} value={brandName}>{brandName}</option>
                      ))
                    }
                  </select>
                </>
              )}

              {type === 'Mountain-Bike' && (
                    <>
                      <h3>Brand</h3>
                      <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                      >
                        <option value="">Select brand</option>
                        {kind === 'non-electric' ? 
                          [
                            "Trek", "Specialized", "Giant", "Cannondale", "Santa Cruz",
                            "Yeti", "Pivot", "Scott", "Norco", "Rocky Mountain",
                            "Kona", "Niner", "Canyon", "Intense", "GT",
                            "BMC", "Marin", "Orbea", "Salsa", "Diamondback",
                            "Commencal", "Transition", "Mondraker", "Ibis", "Felt",
                            "Juliana", "Orange", "Merida", "Whyte", "Devinci",
                            "Lapierre", "Polygon", "Saracen", "Revel", "Alchemy",
                            "Ellsworth", "Guerrilla Gravity", "Propain"
                          ].map((brandName) => (
                            <option key={brandName} value={brandName}>{brandName}</option>
                          ))
                        : 
                          [
                            "Specialized (Turbo Levo, Turbo Kenevo)", "Trek (Powerfly, Rail)",
                            "Giant (Trance E+, Stance E+)", "Cannondale (Moterra, Habit NEO)",
                            "Santa Cruz (Heckler, Bullit)", "Scott (Genius eRIDE, Strike eRIDE)",
                            "Norco (Sight VLT, Range VLT)", "Yeti (160E)",
                            "Canyon (Spectral:ON, Neuron:ON)", "Rocky Mountain (Altitude Powerplay, Instinct Powerplay)",
                            "Pivot (Shuttle)", "Orbea (Wild FS, Rise)",
                            "BMC (Trailfox AMP)", "Haibike (XDURO, SDURO)",
                            "Merida (eONE-SIXTY, eONE-FORTY)", "Intense (Tazer)",
                            "GT (eForce Amp, ePantera)", "Focus (JAM², SAM²)",
                            "Felt (Redemption-E 30)", "Kona (Remote 160, Remote 130)",
                            "Diamondback (Release, Overdrive)", "Mondraker (Crafty, Chaser)",
                            "Commencal (Meta Power, Meta HT Power)", "Lapierre (Overvolt)",
                            "Saracen (Ariel E, Zenith E)", "Cube (Stereo Hybrid, Reaction Hybrid)",
                            "Raleigh (Kodiak IE)", "Whyte (E-150, E-180)",
                            "BH Bikes (AtomX, Rebel)", "Fazua"
                          ].map((brandName) => (
                            <option key={brandName} value={brandName}>{brandName}</option>
                          ))
                        }
                      </select>
                    </>
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

              {type === 'Road-Bike' ? (
                <>
                  <h3>Size</h3>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                  >
                    <option value="">Select size</option>
                    {[47, 50, 52, 54, 56, 58, 60, 62].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </>
              ) : type === 'Mountain-Bike' ? (
                <>
                  <h3>Wheel Size</h3>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                  >
                    <option value="">Select size/ Wheel Frame</option>
                    <option value="XS">XS /26" or 27.5"</option>
                    <option value="S">S /27.5" or 29"</option>
                    <option value="M">M /27.5" or 29"</option>
                    <option value="M/L">M/L /29" or 27.5"</option>
                    <option value="L">L /29" or 27.5"</option>
                    <option value="XL">XL /29" or 27.5"</option>
                    <option value="XXL">XXL /29" or 27.5"</option>
                  </select>
                </>
              ) : (
                <h3>Size</h3>
              )}

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
                <option value="Sleeping bags">Sleeping bags</option>
                <option value="Sleeping pads">Sleeping pads</option>
                <option value="Tents and shelter">Tents and shelter</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Lighting">Lighting</option>
                <option value="Furniture">Furniture</option>
                <option value="Bags and backpacks">Bags and backpacks</option>
                <option value="Outdoor clothing">Outdoor clothing</option>
                <option value="Portable power">Portable power</option>
                <option value="Coolers">Coolers</option>
                {/* <option value="Others">Others</option> */}
              </select>

            {subcategory && (
                <>
                  <h3>Brand</h3>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  >
                    <option value="">Select brand</option>
                    {(() => {
                      switch(subcategory) {
                        case "Sleeping bags":
                          return [
                            "The North Face", "Marmot", "Mountain Hardwear", "REI Co-op", "Big Agnes",
                            "NEMO Equipment", "Kelty", "Western Mountaineering", "Sea to Summit", "Feathered Friends",
                            "Therm-a-Rest", "Rab", "Patagonia", "Sierra Designs", "Outdoor Vitals"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        case "Sleeping pads":
                          return [
                            "Therm-a-Rest", "NEMO Equipment", "Big Agnes", "Sea to Summit", "Exped",
                            "Klymit", "REI Co-op", "Hest", "Coleman", "ALPS Mountaineering",
                            "Hikenture", "Intex", "Outdoorsman Lab"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        case "Tents and shelter":
                          return [
                            "REI Co-op", "Big Agnes", "The North Face", "MSR", "NEMO Equipment",
                            "Coleman", "Kelty", "Marmot", "Hilleberg", "Black Diamond",
                            "Eureka!", "Sierra Designs", "ALPS Mountaineering", "Zpacks", "Hyperlite Mountain Gear",
                            "Tarptent", "Mountain Hardwear", "Outdoor Research", "Six Moon Designs", "Snow Peak"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        case "Kitchen":
                          return [
                            "MSR", "Jetboil", "Coleman", "GSI Outdoors", "Snow Peak",
                            "Primus", "Stanley", "Sea to Summit", "Camp Chef", "BioLite",
                            "Trangia", "Optimus", "Vargo", "YETI", "Cuisinart",
                            "Stansport", "UCO", "Esbit", "ALPS Mountaineering", "REI Co-op"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        case "Lighting":
                          return [
                            "Black Diamond", "Petzl", "Goal Zero", "BioLite", "Coleman",
                            "Princeton Tec", "UCO", "Nite Ize", "Lucid", "Energizer",
                            "Streamlight", "Fenix", "MPOWERD", "LE"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        case "Furniture":
                          return [
                            "Helinox", "REI Co-op", "ALPS Mountaineering", "Kelty", "GCI Outdoor",
                            "Coleman", "Big Agnes", "NEMO Equipment", "KingCamp", "Therm-a-Rest",
                            "TravelChair", "Teton Sports", "Kijaro", "ENO", "Crazy Creek"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        case "Bags and backpacks":
                          return [
                            "Osprey", "Deuter", "Gregory", "The North Face", "Arc'teryx",
                            "REI Co-op", "Kelty", "Granite Gear", "Mystery Ranch", "Hyperlite Mountain Gear",
                            "Patagonia", "CamelBak", "Mountain Hardwear", "Lowe Alpine", "Black Diamond",
                            "Thule", "Fjällräven", "Sea to Summit", "Gossamer Gear", "Mountainsmith"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        case "Outdoor clothing":
                          return [
                            "Patagonia", "The North Face", "Columbia", "Arc'teryx", "Outdoor Research",
                            "Marmot", "REI Co-op", "Mountain Hardwear", "Rab", "Black Diamond",
                            "Helly Hansen", "Prana", "Kuhl", "Fjällräven", "Smartwool",
                            "Icebreaker", "Salomon", "Montbell", "Mammut", "Royal Robbins"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        case "Portable power":
                          return [
                            "Goal Zero", "Anker", "Jackery", "BioLite", "EcoFlow",
                            "Renogy", "Rockpals", "Suaoki", "RAVPower", "Nitecore",
                            "Bluetti", "Westinghouse", "Allpowers", "Powertraveller", "Enginstar"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        case "Coolers":
                          return [
                            "YETI", "Coleman", "Igloo", "RTIC", "Pelican",
                            "Orca", "Engel", "OtterBox", "Grizzly", "K2 Coolers",
                            "Stanley", "Arctic Zone", "Canyon Coolers", "Bison Coolers", "Frost River"
                          ].map(brand => <option key={brand} value={brand}>{brand}</option>);
                        default:
                          return null;
                      }
                    })()}
                  </select>
                  <h3>{subcategory === "Outdoor clothing" ? "Type" : "Size"}</h3>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                  >
                    <option value="">Select {subcategory === "Outdoor clothing" ? "type" : "size"}</option>
                    {(() => {
                      switch(subcategory) {
                        case "Sleeping bags":
                          return ["Regular", "Long", "Short", "Women's Specific", "Kids"]
                            .map(size => <option key={size} value={size}>{size}</option>);
                        case "Sleeping pads":
                          return ["Small/Short", "Regular", "Long", "Wide", "Double"]
                            .map(size => <option key={size} value={size}>{size}</option>);
                        case "Tents and shelter":
                          return ["1-Person", "2-Person", "3-Person", "4-Person", "Family/Group (5+ person)",
                            "Ultralight", "Basecamp", "4-Season"]
                            .map(size => <option key={size} value={size}>{size}</option>);
                        case "Kitchen":
                          return ["Single-Burner Stoves", "Double-Burner Stoves", "Compact/Ultralight Cook Sets",
                            "Family Cook Sets", "Grills and Griddles", "Portable Ovens", "Coffee Makers",
                            "Dutch Ovens and Cast Iron Cookware"]
                            .map(size => <option key={size} value={size}>{size}</option>);
                        case "Lighting":
                          return ["Headlamps", "Lanterns", "String Lights", "Flashlights", "Solar-Powered Lights"]
                            .map(size => <option key={size} value={size}>{size}</option>);
                        case "Furniture":
                          return ["Compact/Ultralight Chairs", "Regular Chairs", "Loveseat/Double Chairs",
                            "Tables", "Cots", "Hammocks"]
                            .map(size => <option key={size} value={size}>{size}</option>);
                        case "Bags and backpacks":
                          return ["Daypacks", "Overnight Packs", "Weekend Packs", "Expedition Packs",
                            "Hydration Packs", "Waist Packs/Fanny Packs"]
                            .map(size => <option key={size} value={size}>{size}</option>);
                        case "Outdoor clothing":
                          return ["Jackets and Parkas", "Pants", "Base Layers", "Insulating Layers",
                            "Footwear", "Accessories"]
                            .map(type => <option key={type} value={type}>{type}</option>);
                        case "Portable power":
                          return ["Power Banks", "Solar Panels", "Portable Power Stations"]
                            .map(size => <option key={size} value={size}>{size}</option>);
                        case "Coolers":
                          return ["Personal/Small Coolers", "Medium Coolers", "Large Coolers",
                            "Extra Large Coolers", "Soft Coolers"]
                            .map(size => <option key={size} value={size}>{size}</option>);
                        default:
                          return null;
                      }
                    })()}
                  </select>

                  {(subcategory === "Sleeping bags" || subcategory === "Outdoor clothing") && (
                    <>
                      <h3>Gender</h3>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Men's">Men's</option>
                        <option value="Women's">Women's</option>
                        <option value="Unisex">Unisex</option>
                        {subcategory === "Sleeping bags" && <option value="Kids'">Kids'</option>}
                      </select>
                    </>
                  )}

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
            </>
          )}

          <div className="create-listing">
            <h3>Where's your gear located?</h3>
            <p style={{ fontSize: "18px", fontWeight: "normal" }}>
              Your address is only shared with renters after they've made a reservation.
            </p>
            <input
              id="autocomplete"
              type="text"
              placeholder="Enter your address"
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              name="address"
              value={formLocation.address}
              onChange={handleChangeLocation}
              required
            />
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
          <ImageUploading
            multiple
            value={photos}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
            acceptType={acceptedFileTypes}
            onError={onError}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              <div className="photos" {...dragProps}>
                {photos.length < 1 && (
                  <label htmlFor="image" className="alone" onClick={onImageUpload}>
                    <div className="icon">
                      <IoImageOutline />
                    </div>
                    <p>Upload from your device</p>
                  </label>
                )}

                {photos.length >= 1 && (
                  <>
                    {imageList.map((image, index) => (
                      <div key={index} className="photo">
                        <img src={image.data_url} alt={`gear-${index}`} />
                        <button
                          type="button"
                          onClick={() => onImageRemove(index)}
                        >
                          <BiTrash />
                        </button>
                      </div>
                    ))}
                    <label htmlFor="image" className="together" onClick={onImageUpload}>
                      <div className="icon">
                        <IoImageOutline />
                      </div>
                      <p>Upload from your device</p>
                    </label>
                  </>
                )}
              </div>
            )}
          </ImageUploading>
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
