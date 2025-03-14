import React, { useState } from 'react';
import '../styles/ImageGallery.css';
import {  Close } from '@mui/icons-material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
const ImageGallery = ({ images, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="image-gallery">
      <div className="image-gallery-overlay" onClick={onClose}></div>
      <div className="image-gallery-content">
        <img src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} />
        <button className="image-gallery-close" onClick={onClose}>
          <Close />
        </button>
        <button className="image-gallery-prev" onClick={goToPreviousImage}>
        <ArrowCircleLeftIcon />
        </button>
        <button className="image-gallery-next" onClick={goToNextImage}>
        <ArrowCircleRightIcon  />
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;