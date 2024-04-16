import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

export default function Featured({ product }) {
  const { addProduct } = useContext(CartContext); //from useContext we want to grab some info
  function addNewProductToCart() {
    addProduct(product._id);
  }

  return (
    <div>
      <p>{product.title}</p>
      <p>{product.description}</p>
      <Link href={"/products/" + product._id}>
        See more details(make it a button with the link to it)
      </Link>
      <button onClick={addNewProductToCart}>Add to cart</button>
    </div>
  );
}
