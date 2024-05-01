import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

export default function Account() {
  const { data: session } = useSession();
  const router = useRouter();
  // console.log(session);

  const { wishlistProducts, addProductToWishlist, removeProductFromWishlist } =
    useContext(CartContext);
  const [wishlist, setWishlist] = useState([]);
  const [name, setName] = useState(session?.user?.name || "");
  const [surname, setSurname] = useState(session?.user?.surname || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState(session?.user?.phone || "");
  const [visible, setVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  async function logout() {
    await signOut({ redirect: false }); // prevents next-auth from redirecting
    router.push("/"); //after user is logged out, it now redirects the user to home page
  }

  async function login() {
    await signIn("google", { prompt: "select_account" });
  }

  //updates account info
  function handleUpdateProfile(e) {
    e.preventDefault();
    const data = { name, surname, email, phone };
    axios.put("/api/account", data);
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
    axios.get("/api/account").then((response) => {
      setName(response.data.name);
      setSurname(response.data.surname);
      setEmail(response.data.email);
      setPhone(response.data.phone);
    });
  }, []);

  //
  async function handleUpdateProfile(e) {
    e.preventDefault();
    setIsUpdating(true); // Show spinner

    try {
      const data = { name, email, phone };
      await axios.put("/api/account", data);
      setIsUpdating(false);
      setUpdateSuccess(true); // Show success message

      setTimeout(() => {
        setUpdateSuccess(false); // Reset button after 2 seconds
      }, 2000);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      setIsUpdating(false);
      // Optionally handle error state
    }
  }

  // Mock function to fetch wishlist details, replace with your API call or context method
  // useEffect(() => {
  //   if (wishlistProducts.length > 0) {
  //     // Replace '/api/wishlist' with your endpoint
  //     axios
  //       .post("/api/wishlist", { ids: wishlistProducts })
  //       .then((response) => setWishlist(response.data))
  //       .catch((error) => console.error("Error fetching wishlist:", error));
  //   } else {
  //     setWishlist([]);
  //   }
  // }, [wishlistProducts]);

  return (
    <>
      <div className="container mx-auto pt-10 mt-60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Wishlist */}
          <div
            className={`border p-4 ${
              visible ? "fadeInUp visible" : "fadeInUp"
            }`}
          >
            <h2 className="font-bold text-lg mb-4">Wishlist</h2>
            <ul>
              {wishlist.map((item) => (
                <li key={item.id} className="mb-2 p-2 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={50}
                        height={50}
                      />
                      <span>{item.title}</span>
                    </div>
                    <button onClick={() => removeProductFromWishlist(item.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {wishlist.length === 0 && <p>Your wishlist is empty.</p>}
          </div>

          {/* Account Info */}
          <div
            className={`border p-4 ${
              visible ? "fadeInUp visible" : "fadeInUp"
            }`}
          >
            <h2 className="font-bold text-lg mb-4">Account Information</h2>
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
            {session && (
              <button
                onClick={logout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Log out
              </button>
            )}
            {!session && (
              <button
                onClick={login}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
