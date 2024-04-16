import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    "/photo1.jpg",
    "/photo2.jpg",
    "/photo3.jpg",
    "/photo1.jpg",
    "/photo2.jpg",
  ];

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-lg h-96 md:h-[800px]">
        {images.map((src, index) => (
          <div
            key={src}
            className={`duration-700 ease-in-out ${
              currentSlide === index ? "block" : "hidden"
            }`}
          >
            <Image
              src={src}
              layout="fill"
              objectFit="cover"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-gray-500"
            }`}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        type="button"
        className="absolute top-0 left-0 z-30 p-4"
      >
        <span className="sr-only">Previous</span>
        {/* Previous SVG icon */}
      </button>

      <button
        onClick={goToNext}
        type="button"
        className="absolute top-0 right-0 z-30 p-4"
      >
        <span className="sr-only">Next</span>
        {/* Next SVG icon */}
      </button>
    </div>
  );
}
