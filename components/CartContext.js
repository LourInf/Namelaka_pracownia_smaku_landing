import { createContext, useEffect, useState } from "react";

// Creating a new React context for the shopping cart
export const CartContext = createContext({});

// Provider component for the CartContext that will wrap around the child components (in app.js)
export function CartContextProvider({ children }) {
  // ls=localStorage. To check if window is defined to prevent issues during server-side rendering
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]); //Keeps track of products in the cart

  // This effect updates localStorage whenever cartProducts changes
  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem("cart", JSON.stringify(cartProducts));
      //   console.log("Updated cartProducts:", cartProducts);
    }
  }, [cartProducts]);

  // This effect initializes cartProducts from localStorage once, when the component mounts
  useEffect(() => {
    if (ls && ls?.getItem("cart")) {
      const storedCart = JSON.parse(ls.getItem("cart"));
      //   console.log("Stored Cart:", storedCart);
      setCartProducts(storedCart);
    }
  }, []);
  // Adds a product to the cart. Important: we use a callback to ensure we get the latest state
  function addProduct(productId) {
    setCartProducts((prev) => [...prev, productId]);
  }

  function decreaseProduct(productId) {
    setCartProducts((prev) => {
      let found = false;
      return prev.filter((item) => {
        if (!found && item === productId) {
          found = true; // Mark the first match as found and skip it
          return false;
        }
        return true; // Keep all other items
      });
    });
  }

  function removeProduct(productId) {
    setCartProducts((prev) => prev.filter((id) => id !== productId));
  }

  function clearCart() {
    setCartProducts([]);
    ls?.removeItem("cart"); // Remove the cart from localStorage
  }

  // Rendering the context provider with the current cartProducts state and functions to modify it
  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        decreaseProduct,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
