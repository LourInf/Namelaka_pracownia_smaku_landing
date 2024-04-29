import axios from "axios";
import { useEffect, useRef, useState, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import { debounce } from "lodash";
import Spinner from "@/components/Spinner";

export default function Search() {
  const inputRef = useRef(null); // Create a ref object
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Automatically focus the input field when the component is rendered
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  //when phrase changes I want to search for a product
  const debouncedSearch = useCallback(
    debounce((nextValue) => {
      setLoading(true);
      axios
        .get("/api/products?phrase=" + encodeURIComponent(nextValue))
        .then((response) => {
          //   console.log(response.data);
          setProducts(response.data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    }, 400),
    []
  ); // 400 ms delay

  // Create a debounced version of the search function
  useEffect(() => {
    if (phrase.length > 0) {
      debouncedSearch(phrase);
    } else {
      setProducts([]);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [phrase, debouncedSearch]);

  return (
    <>
      <form className="max-w-md mx-auto mt-60">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            required
            ref={inputRef}
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>
      {!loading && phrase !== "" && products.length === 0 && (
        <div className="text-center py-4">
          No products found for <b>{phrase}</b>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-start pt-32 h-screen">
          <Spinner />
        </div>
      )}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
