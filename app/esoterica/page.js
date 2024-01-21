"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css'

const Carousel = () => {

  const numImages = 226; // Replace with the actual number of images you have
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * numImages) + 1);

  
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
    <div className={styles.carousel_container}>
      <div className={styles.carousel}>
        {Array.from({ length: numImages }).map((_, index) => (
          <div
            key={index}
            className={`${styles.carousel_item} ${index === currentIndex ? `${styles.active}` : `${styles.notActive}`}`}
          >
            {
              index === currentIndex &&
              
              <Image
                className={styles.image}
                src={`/images/esoterica/${getImageName(index)}`} // Assuming images are in the 'public/images/esoterica' directory
                alt={`Photo ${index + 1}`}
                width={300}
                height={200}
              />
            }
          </div>
        ))}
      </div>
      <div className={styles.carousel_buttons}>
        <button className={styles.carousel_button} onClick={prevSlide}>
          Previous
        </button>
        <button className={`${styles.carousel_button} ${styles.random}`} onClick={randomSlide}>
          Random
        </button>
        <button className={styles.carousel_button} onClick={nextSlide}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Carousel;
