import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ProductCard from "@/components/ProductCard";
import OrderLine from "@/components/OrderLine";

export default function Account() {
  const { data: session } = useSession();
  const router = useRouter();
  // console.log(session);

  const [name, setName] = useState(session?.user?.name || "");
  const [surname, setSurname] = useState(session?.user?.surname || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState(session?.user?.phone || "");
  const [visible, setVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState("orders"); // Default active tab orders
  const [orders, setOrders] = useState([]);

  async function logout() {
    await signOut({ redirect: false }); // prevents next-auth from redirecting
    router.push("/"); //after user is logged out, it now redirects the user to home page
  }

  async function login() {
    await signIn("google", { prompt: "select_account" });
  }

  //updates account info
  async function handleUpdateProfile(e) {
    e.preventDefault();
    setIsUpdating(true); // Show spinner

    const data = { name, surname, email, phone };
    axios
      .put("/api/account", data)
      .then(() => {
        setIsUpdating(false);
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 2000); //reset btn after 2secs
      })
      .catch((error) => {
        console.error(
          "Error updating profile:",
          error.response?.data || error.message
        );
        setIsUpdating(false);
      });
  }

  //animation so that wishlist and account info cards appear slowly on the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500); // Delays the animation by 500ms after component mounts

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  //fetches the current account info from db
  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get("/api/account").then((response) => {
      setName(response.data.name);
      setSurname(response.data.surname);
      setEmail(response.data.email);
      setPhone(response.data.phone);
    });
    axios
      .get("/api/wishlist")
      .then((response) => {
        // console.log("Wishlist Data:", response.data);
        setWishlist(response.data);
      })
      .catch((error) => console.error("Error fetching wishlist:", error));
    axios
      .get("/api/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => console.error("Error fetching wishlist:", error));
  }, [session]);

  //this will make the liked product dissapear from wishlist if heart is clicked to unlike
  function productRemovedFromWishlist(idToRemove) {
    setWishlist((prev) => {
      return [...prev.filter((p) => p._id.toString() !== idToRemove)];
    });
  }

  return (
    <>
      <div className="md:flex mt-60 mx-60">
        <ul className="flex-column space-y-4 text-sm font-medium text-gray-500 md:me-4 mb-4 md:mb-0">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`inline-flex items-center px-4 py-3 text-gray-500 rounded-lg w-full ${
                activeTab === "profile"
                  ? "bg-blue-700"
                  : "bg-gray-50 hover:text-gray-900 hover:bg-gray-100"
              }`}
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${
                activeTab === "wishlist"
                  ? "bg-blue-700"
                  : "bg-gray-50 hover:text-gray-900 hover:bg-gray-100"
              }`}
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
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              Wishlist
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("orders")}
              className={`inline-flex items-center px-4 py-3 text-gray-500 rounded-lg w-full ${
                activeTab === "orders"
                  ? "bg-blue-700"
                  : "bg-gray-50 hover:text-gray-900 hover:bg-gray-100"
              }`}
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
                  d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                />
              </svg>
              Orders
            </button>
          </li>
          <li>
            {session ? (
              <div className="flex flex-row">
                <button
                  onClick={logout}
                  className="text-red-500 mt-4 pl-4 flex"
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
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Log in with Google
              </button>
            )}
          </li>
        </ul>
        <div className="p-6 bg-gray-50 text-medium text-gray-500 rounded-lg w-full">
          {activeTab === "profile" && (
            <div className="px-80">
              <h2 className="font-bold text-lg mb-4">
                {session ? "Account Information" : "Login"}
              </h2>
              {session && (
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="surname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Surname
                    </label>
                    <input
                      type="text"
                      id="surname"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder=" "
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleUpdateProfile}
                    className={`w-full py-2 rounded-md text-white ${
                      updateSuccess ? "bg-green-500" : "bg-black"
                    }`}
                    disabled={isUpdating || updateSuccess}
                  >
                    {isUpdating ? (
                      <ClipLoader color="#ffffff" size={24} />
                    ) : updateSuccess ? (
                      "Your profile was updated!"
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>
              )}
              {session ? (
                <button
                  onClick={logout}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Log out
                </button>
              ) : (
                <button
                  onClick={login}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Log in with Google
                </button>
              )}
            </div>
          )}
          {activeTab === "wishlist" && (
            <div className="px-10">
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wishlist.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      onRemoveFromWishlist={productRemovedFromWishlist}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm">
                  {session
                    ? "Your wishlist is empty."
                    : "Log in to add products to your wishlist."}
                </p>
              )}
            </div>
          )}
          {activeTab === "orders" && (
            <div className="px-10">
              {orders.length > 0 &&
                orders.map((o) => <OrderLine {...o} key={o.id} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
