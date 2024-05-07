import NavigationBar from "@/components/NavigationBar";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useState } from "react";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

export default function ProductPage({ product }) {
  const { addProduct } = useContext(CartContext);
  const [currentImage, setCurrentImage] = useState(product?.images?.[0]); // to manage the current main image and changes it when any of the smaller images are clicked.

  return (
    <>
      <NavigationBar />
      <div className="flex flex-col mt-60 md:flex-row">
        <div className="flex-1 bg-red">
          <img
            // src={product?.images?.[0]}
            src={currentImage}
            alt={product?.title}
            className="h-full max-h-80"
          />
          <div className="flex space-x-2 mt-2">
            {product?.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product view ${index + 1}`}
                className={`w-20 h-20 object-cover ${
                  currentImage === image ? "border-4 border-gold" : "opacity-75"
                }`}
                onClick={() => setCurrentImage(image)} // Update the main image on click
              />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{product?.title}</h1>
          <p className="text-xl">${product?.price}</p>
          <div>{/* Star rating component here */}</div>
          <p className="mt-2">{product?.description}</p>

          {/* Size selection */}
          <div className="mt-4">
            <label htmlFor="size">Size:</label>
            <select id="size" className="border rounded p-2">
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
            </select>
          </div>

          <button
            onClick={() => addProduct(product._id)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
                focus:outline-none focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center"
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
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            Add to cart
          </button>
          <button className="p-2 ml-2">{/* Heart icon */}</button>

          {/* Accordion for additional information */}
          <div className="mt-4">{/* Accordion component here */}</div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  //   console.log({query: context.query});
  await mongooseConnect();
  const { id } = context.query;

  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
