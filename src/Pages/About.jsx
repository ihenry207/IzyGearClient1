import React, { useRef, useEffect, useState } from 'react';
import FilterOverlay from '../components/FilterOverlay';
import Navbar from "../components/Navbar";
import "../styles/About.css";
import { Loader } from '@googlemaps/js-api-loader';

const About = () => {
  const inputRef = useRef();
  const autocompleteRef = useRef();
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      const options = {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'icon', 'name'],
        types: ['establishment'],
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        setSelectedPlace(place);
        console.log(place);
      });
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="about-container">
        <h1>About</h1>
        <div>
          <label>Enter address:</label>
          <input ref={inputRef} />
        </div>
        {selectedPlace && (
          <div>
            <h3>Selected Place:</h3>
            <p>Name: {selectedPlace.name}</p>
            <p>Address: {selectedPlace.formatted_address}</p>
          </div>
        )}
      </div>
      <FilterOverlay />
    </div>
  );
};

export default About;