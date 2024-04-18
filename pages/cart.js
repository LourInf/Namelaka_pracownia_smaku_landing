import { CartContext } from "@/components/CartContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";

export default function Cart() {
  const { cartProducts } = useContext(CartContext);
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

  return (
    <div className="pt-60 flex justify-center items-start space-x-4 p-8">
      {/* Left Card - Cart items */}

      <div className="flex-grow bg-white p-6 shadow-lg rounded-lg">
        <h2>Cart</h2>
        {!cartProducts?.length && <div>Your cart is empty</div>}
        {products?.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width="60"
                      height="60"
                    />
                    {product.title}
                  </td>
                  <td>
                    {cartProducts.filter((id) => id === product._id).length}
                  </td>
                  <td>
                    {cartProducts.filter((id) => id === product._id).length *
                      product.price}
                    PLN
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Right Card - Order info*/}
      {!!cartProducts?.length && (
        <div className="bg-black text-white p-6 shadow-lg rounded-lg w-80">
          <h2 className="text-lg font-bold mb-4">Order information</h2>
          <input
            type="text"
            placeholder="Address 1"
            className="outline-none w-full"
          />
          <input
            type="text"
            placeholder="Address 2"
            className="outline-none w-full"
          />
          <button className="w-full bg-white text-black py-2 rounded-md">
            Continue to payment
          </button>
        </div>
      )}
    </div>
  );
}
