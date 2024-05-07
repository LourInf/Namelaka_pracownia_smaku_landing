import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

export default function Featured({ product, adText, subAdText }) {
  const { addProduct } = useContext(CartContext); //from useContext we want to grab some info
  // console.log({ product });
  function addNewProductToCart() {
    addProduct(product._id);
  }

  return (
    <div className="bg-white p-8 grid grid-cols-3 gap-4 px-40">
      {/* Advertisement Text Section */}
      <div className="col-span-1 flex items-center justify-center">
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
          {adText}
        </p>
        <p className="text-4xl text-gray-600 italic">{subAdText}</p>
      </div>
      {/* Product Details and Actions */}
      <div className="col-span-1 flex flex-col justify-end items-end space-y-3">
        <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
        <p className="text-gray-600">{product.description}</p>
        <Link
          href={"/products/" + product._id}
          className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
        >
          See details →
        </Link>
        <button
          onClick={addNewProductToCart}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
        >
          Add to cart
        </button>
      </div>
      {/* Product Image */}
      <div className="col-span-1 flex justify-center items-center">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-80 h-80 object-cover rounded-full"
        />
      </div>
    </div>
  );
}
