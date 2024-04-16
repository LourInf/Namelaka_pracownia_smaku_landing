import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "./CartContext";

export default function NavigationBar() {
  const { cartProducts } = useContext(CartContext);
  return (
    <nav className="absolute top-0 left-0 w-full z-10 bg-gray-300 bg-opacity-40 backdrop-filter backdrop-blur-sm">
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
                href="/offer"
                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm p-2"
              >
                Offer
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm p-2"
              >
                E-shop
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
            {/* Cart and later add user account and maybe favorites */}
            <li>
              <Link href="/cart" className="">
                Cart({cartProducts.length})
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
