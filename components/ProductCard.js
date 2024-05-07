import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

//receives a product object and an optional array of wishedProducts ids
export default function ProductCard({
  product,
  wishedProducts = [],
  onRemoveFromWishlist = () => {},
}) {
  const { addProduct } = useContext(CartContext);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isLiked, setIsLiked] = useState(
    wishedProducts.includes(product._id.toString()) //to manage 'isLiked' state, which checks if the current product's id is in the wishedProducts array, converting product._id to string for comparison
  );

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

  const HeartOutlineIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );

  const HeartSolidIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );

  function addToWishlist() {
    const nextValue = !isLiked; // Determine the new liked state by negating the current state
    setIsLiked(nextValue); // update the UI to reflect the new liked state
    // if product is unliked and there's a wishlist, we remove that product from wishlist
    if (nextValue == false && onRemoveFromWishlist) {
      onRemoveFromWishlist(product._id);
    }
    // Make a POST request to update the wishlist on the server
    axios
      .post("/api/wishlist", { product: product._id, liked: nextValue })
      .then((response) => {
        console.log("Wishlist updated:", response.data);
      })
      .catch((error) => {
        console.error("Failed to update wishlist", error);
        setIsLiked(!nextValue); // Revert the isLiked state if the server update fails
      });
  }

  return (
    <div className="w-full max-w-60 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link href={`/product/${product._id}`}>
        <Image
          className="p-8 rounded-t-lg"
          src={product.images[0]}
          alt={`Image of ${product.title}`}
          width={500}
          height={300}
          layout="responsive"
        />
      </Link>
      <div className="px-5 pb-5">
        <Link href={`/product/${product._id}`}>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {product.title}
          </h5>
        </Link>
        <div className="flex items-center justify-between mb-5">
          <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {product.price} zł
          </span>
          <button onClick={addToWishlist} className="mt-1">
            {isLiked ? <HeartSolidIcon /> : <HeartOutlineIcon />}
          </button>
        </div>
        <button
          onClick={() => handleAddToCart(product._id)}
          className={`relative text-white ${
            addedToCart
              ? "bg-green-200 hover:bg-green-300"
              : "bg-blue-700 hover:bg-blue-800"
          } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 min-w-[120px] flex items-center justify-center`}
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
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
}
