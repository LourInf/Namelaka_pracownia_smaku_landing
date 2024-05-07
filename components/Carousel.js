import React, { useState } from "react";
import Image from "next/image";

export default function Carousel({ images }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-sm h-96 md:h-[500px] lg:h-[600px] xl:h-[700px]">
        {images.map((src, index) => (
          <div
            key={src} // use the image URL as the key not index! when using index only 1 img was showing
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentSlide === index ? "opacity-100" : "opacity-0"
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

      {/* Left arrow */}
      <button
        onClick={goToPrevious}
        type="button"
        className="absolute left-0 top-1/2 z-30 p-4 -translate-y-1/2 text-gold"
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
          />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={goToNext}
        type="button"
        className="absolute right-0 top-1/2 z-30 p-4 -translate-y-1/2 text-gold"
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
