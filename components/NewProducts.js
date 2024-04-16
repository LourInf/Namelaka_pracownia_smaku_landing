import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

export default function NewProducts({ newProducts }) {
  const { addProduct } = useContext(CartContext);
  return (
    <div>
      <h1 className="text-2xl text-center mb-10">Newly Added Products</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {newProducts.length > 0 &&
          newProducts?.map((product, _id) => (
            <div
              key={_id}
              className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <Link href={`/product/${product._id}`}>
                <Image
                  className="p-8 rounded-t-lg"
                  src={product.images[0]}
                  alt="product image"
                  width={500} // Specify the correct size as per your design
                  height={300} // Specify the correct size as per your design
                  layout="responsive"
                />
              </Link>
              <div className="px-5 pb-5">
                <Link href={`/product/${product._id}`}>
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {product.title}
                  </h5>
                </Link>
                <div className="flex items-center mt-2.5 mb-5">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    {/* Repeated SVG star icons, replace as needed */}
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className="w-4 h-4 text-yellow-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                    5.0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => addProduct(_id)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
                focus:outline-none focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center dark:bg-blue-600
                dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
