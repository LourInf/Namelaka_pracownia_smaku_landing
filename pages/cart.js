import { CartContext } from "@/components/CartContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";

export default function Cart() {
  //'products' stores detailed info about the products (id, title, description, img...) that we can use as a state to display info to the user
  //white 'cartProducts' only stores product id, which we use for tracking which products are in the cart
  const { cartProducts, addProduct, decreaseProduct, removeProduct } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);

  //When items are added to the cart, their IDs are stored in cartProducts. So whenever cartProducts>0 then I want to grab the info from our products (and i put that inside a state too)
  // This useEffect is triggered when cartProducts changes (eg. when items are added to or removed from the cart).
  useEffect(() => {
    // Only proceed if cartProducts has items
    if (cartProducts.length > 0) {
      // Send a POST request to the server with the cart product IDs
      axios
        .post("/api/cart", { ids: cartProducts })
        //The server then looks up the full details for these products in the database and returns this data
        .then((response) => {
          // If successful, use setProducts to store all the product details in the state, so we can display in the cart section of my UI
          setProducts(response.data);
        })
        .catch((error) => {
          // If there's an error, log it to the console
          console.error(
            "Error fetching cart products:",
            error.response?.data || error.message
          );
        });
    }
  }, [cartProducts]);

  function increaseQtyOfProduct(id) {
    addProduct(id);
  }

  function decreaseQtyOfProduct(id) {
    decreaseProduct(id);
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  return (
    <div className="pt-60 flex justify-center items-start px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left section - Cart items */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex justify-between border-b p-4">
            <h1 className="text-lg font-bold">Shopping Cart</h1>
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const quantity = cartProducts.filter(
                  (id) => id === product._id
                ).length;
                return (
                  <tr
                    key={product._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          width="60"
                          height="60"
                          className="rounded"
                        />
                        <span className="font-bold text-gray-900 dark:text-white">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => decreaseQtyOfProduct(product._id)}
                          className="text-gray-500 bg-white border border-gray-300 rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => increaseQtyOfProduct(product._id)}
                          className="text-gray-500 bg-white border border-gray-300 rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {product.price} PLN
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removeProduct(product._id)}
                        className="text-red-600 hover:underline dark:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end mt-4 p-4">
            <span className="text-lg font-bold">Total: {total} PLN</span>
          </div>
        </div>

        {/* Right section - Order info */}
        <div className="bg-black text-white p-6 shadow rounded-lg w-full md:w-80">
          <h2 className="text-lg font-bold mb-4">Order information</h2>
          <input
            type="text"
            placeholder="Address 1"
            className="mb-4 p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Address 2"
            className="mb-4 p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <button className="w-full bg-white text-black py-2 rounded-md">
            Continue to payment
          </button>
        </div>
      </div>
    </div>
  );
}
