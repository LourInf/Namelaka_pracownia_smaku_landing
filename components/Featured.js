import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import ClipLoader from "react-spinners/ClipLoader";

export default function Featured({ product, adText, subAdText }) {
  const { addProduct } = useContext(CartContext); //from useContext we want to grab some info
  // console.log({ product });
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleAddToCart = (productId) => {
    addProduct(productId); // Trigger addProduct when clicked
    setShowSpinner(true);
    setTimeout(() => {
      setShowSpinner(false);
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000); // Show check for 2 seconds
    }, 500); // Show spinner for 500ms
  };

  const ShoppingBagIcon = () => (
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
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );

  return (
    <div className="bg-custom-green p-8 py-16 grid grid-cols-2 gap-8">
      {/* Advertisement Text Section */}
      <div className="col-span-1 flex items-center justify-center flex-col text-center space-y-4">
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair-display text-gray-800">
          {adText}
        </p>
        <p className="text-lg md:text-xl lg:text-2xl text-gold italic font-lato">
          {subAdText}
        </p>
      </div>
      {/* Product Image with Cart Button and Details Link */}
      <div className="relative flex flex-col items-center justify-center">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-80 h-80 object-cover rounded-full shadow-lg"
        />
        <button
          onClick={() => handleAddToCart(product._id)}
          className="absolute bottom-9 btn-cart transition duration-300 ease-in-out"
          style={{ minWidth: "40px" }}
        >
          {showSpinner ? (
            <ClipLoader color="#ffffff" size={24} />
          ) : addedToCart ? (
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
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          )}
        </button>
        <Link
          href={"/products/" + product._id}
          className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out text-lg mt-8"
        >
          See details →
        </Link>
      </div>
    </div>
  );
}
