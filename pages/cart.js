import { CartContext } from "@/components/CartContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function Cart() {
  //'products' stores detailed info about the products (id, title, description, img...) that we can use as a state to display info to the user
  //white 'cartProducts' only stores product id, which we use for tracking which products are in the cart
  const {
    cartProducts,
    addProduct,
    decreaseProduct,
    removeProduct,
    clearCart,
  } = useContext(CartContext);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [terms, setTerms] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

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
    } else {
      setProducts([]);
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

  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      surname,
      terms,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  useEffect(() => {
    if (window.location.href.includes("success")) {
      Swal.fire({
        title: "Thank you for your order!",
        text: "We will email you when your order will be sent.",
        icon: "success",
        confirmButtonText: "Back to home",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/");
        }
      });
      clearCart();
    }
  }, [router]);

  return (
    <div className="pt-60 flex justify-center items-start px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left section - Cart items */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex justify-between border-b p-4">
            <h1 className="text-lg font-bold">Shopping Cart</h1>
          </div>
          {products.length > 0 ? (
            <>
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
                          {product.price * quantity} PLN
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => removeProduct(product._id)}
                            className="hover:underline dark:text-red-500"
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
            </>
          ) : (
            <div className="p-4 px-60">Your cart is empty</div>
          )}
        </div>

        {/* Right section - Order info */}
        <div className="bg-red-100 text-white p-6 shadow rounded-lg w-full md:w-80">
          <h2 className="text-lg font-bold mb-4">Order information</h2>

          {/* <form method="post" action="/api/checkout" class="max-w-md mx-auto"> --> for testing with btn submit and input hidden.*/}
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="floating_email"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
              placeholder=" "
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="floating_email"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>

          <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="name"
                id="floating_first_name"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                placeholder=" "
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label
                htmlFor="floating_first_name"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                First name
              </label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="surname"
                id="floating_last_name"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                placeholder=" "
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
              <label
                htmlFor="floating_last_name"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Last name
              </label>
            </div>
          </div>
          <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full mb-5 group">
              <input
                type="tel"
                name="phone"
                id="floating_phone"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                placeholder=" "
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label
                for="floating_phone"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Phone number
              </label>
            </div>
          </div>
          <div class="flex items-center mb-4">
            <input
              id="checkbox-1"
              name="terms"
              type="checkbox"
              checked={terms}
              required
              onChange={(e) => setTerms(e.target.checked)}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="checkbox-1"
              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              I agree to the
              <Link
                href="#"
                class="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </Link>
              .
            </label>
          </div>
          {/* <input type="hidden" name="products" value={cartProducts.join(",")} /> */}
          {/*used to send as well in the background the ids of all products when testing the form for payment*/}
          <button
            // type="submit"
            onClick={goToPayment}
            className="w-full bg-white text-black py-2 rounded-md"
          >
            Continue to payment
          </button>
          {/* </form> */}
        </div>
      </div>
    </div>
  );
}
