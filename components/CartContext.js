import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  useEffect(() => {
    if (cartProducts?.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartProducts));
    }
  }, [cartProducts]);
  function addProduct(productId) {
    //this function will set the cartProducts to the previous ones plus the newly added productId
    setCartProducts((prev) => [...prev, productId]);
  }
  return (
    <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct }}>
      {children}
    </CartContext.Provider>
  );
}
