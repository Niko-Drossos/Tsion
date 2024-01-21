"use client"
import React, { useState } from 'react';
import Image from 'next/image';

const Carousel = () => {

  const numImages = 226; // Replace with the actual number of images you have
  const [currentIndex, setCurrentIndex] = useState(1);

  const getImageName = (index) => `Photo${(index + 1).toString().padStart(3, '0')}.jpg`;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numImages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numImages) % numImages);
  };

  const randomSlide = () => {
    setCurrentIndex(Math.floor(Math.random() * numImages) + 1)
  }

  return (
    <div className="carousel-container">
      <div className="carousel">
        {Array.from({ length: numImages }).map((_, index) => (
          <div
            key={index}
            className={`carousel-item ${index === currentIndex ? 'active' : 'notActive'}`}
          >
            {
              index === currentIndex &&
              
              <Image
                className={`image`}
                src={`/images/esoterica/${getImageName(index)}`} // Assuming images are in the 'public/images/esoterica' directory
                alt={`Photo ${index + 1}`}
                width={300}
                height={200}
              />
            }
          </div>
        ))}
      </div>
      <div className="carousel-buttons">
        <button className="carousel-button" onClick={prevSlide}>
          Previous
        </button>
        <button className="carousel-button" onClick={nextSlide}>
          Next
        </button>
        <button className="carousel-button" onClick={randomSlide}>
          Random
        </button>
      </div>
    </div>
  );
};

export default Carousel;
