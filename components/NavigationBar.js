import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";

export default function NavigationBar() {
  const { cartProducts } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-custom-pink relative font-lato">
      <div className="container flex flex-wrap justify-between items-center mx-auto p-4">
        <button
          className="text-gray-900 md:hidden"
          aria-label="Toggle Menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        {/* Links before the logo for desktop */}
        <div className="hidden md:flex md:flex-1 justify-start">
          <ul className="flex flex-row space-x-8">
            <li>
              <Link href="/" className="rounded-lg text-sm p-2">
                Home
              </Link>
            </li>
            <li>
              <Link href="/categories" className="rounded-lg text-sm p-2">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/products" className="rounded-lg text-sm p-2">
                All products
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-logo mx-auto">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo_namelaka_nobg.png"
              alt="Namelaka Logo"
              width={150}
              height={150}
              className="shrink-0"
            />
          </Link>
        </div>
        {/* Links after the logo for desktop */}
        <div className="hidden md:flex md:flex-1 justify-end">
          <ul className="flex flex-row space-x-8">
            <li>
              <Link href="/about" className="rounded-lg text-sm p-2">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="rounded-lg text-sm p-2">
                Contact
              </Link>
            </li>
            <li>
              {/* Cart */}
              <Link href="/cart" className="relative flex items-center">
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
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <span className="absolute -top-2 -right-3 bg-custom-magenta text-white rounded-full px-2 text-xs">
                  {cartProducts.length}
                </span>
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
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </Link>
            </li>
            <li>
              {/* Search */}
              <Link href="/search" className="">
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
                    d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
        {/* Mobile menu overlay for mobiles */}
        <div
          className={`${
            isOpen ? "fixed inset-0 bg-black bg-opacity-75 z-40" : "hidden"
          } md:hidden`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex flex-col items-center justify-center min-h-screen text-center space-y-4"
            onClick={(e) => e.stopPropagation()} // Prevents click inside the menu from closing it
          >
            <Link href="/" className="rounded-lg text-sm p-2 text-white">
              Home
            </Link>
            <Link
              href="/categories"
              className="rounded-lg text-sm p-2 text-white"
            >
              Categories
            </Link>
            <Link
              href="/products"
              className="rounded-lg text-sm p-2 text-white"
            >
              All products
            </Link>
            <Link href="/about" className="rounded-lg text-sm p-2 text-white">
              About us
            </Link>
            <Link href="/contact" className="rounded-lg text-sm p-2 text-white">
              Contact
            </Link>
            <Link href="/cart" className="rounded-lg text-sm p-2 text-white">
              Cart({cartProducts.length})
            </Link>
            <Link href="/account" className="rounded-lg text-sm p-2 text-white">
              Account
            </Link>
            <Link href="/search" className="rounded-lg text-sm p-2 text-white">
              Search
            </Link>
            <button
              className="mt-10 p-2 rounded bg-red-600 text-white"
              onClick={() => setIsOpen(false)}
            >
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
