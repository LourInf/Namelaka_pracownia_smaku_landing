import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "./CartContext";

export default function NavigationBar() {
  const { cartProducts } = useContext(CartContext);
  return (
    <nav className="bg-custom-pink">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <div className="flex md:order-1">
          {/* Left side links */}
          <ul className="flex flex-row mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <li>
              <Link
                href="/"
                aria-current="page"
                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm p-2"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm p-2"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm p-2"
              >
                All products
              </Link>
            </li>
          </ul>
        </div>

        {/* Center logo */}
        <div className="md:order-2">
          <Link
            href="/"
            className="flex items-center justify-center md:justify-start"
          >
            <Image
              src="/logo_namelaka_nobg.png"
              alt="Namelaka Logo"
              width={200}
              height={200}
            />
          </Link>
        </div>
        {/* Right side links */}
        <div
          className="hidden justify-between items-center w-full md:flex md:w-auto md:order-3"
          id="navbar-sticky"
        >
          <ul className="flex flex-row mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <li>
              <Link
                href="/about"
                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm p-2"
              >
                About us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm p-2"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link href="/cart" className="">
                Cart({cartProducts.length})
              </Link>
            </li>
            <li>
              <Link href="/account" className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/search" className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
