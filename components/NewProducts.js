import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// This component displays newly added products. It maps over "newProducts" to render each as a "ProductCard", passing down the "wishedProducts" to indicate if a product is liked.
export default function NewProducts({ newProducts, wishedProducts }) {
  // console.log({ wishedProducts });
  return (
    <div>
      <h1 className="text-2xl text-center mb-10">Newly Added Products</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {newProducts.length > 0 &&
          newProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              wishedProducts={wishedProducts} /// pass wishedProducts to check if the product is liked
            />
          ))}
      </div>
    </div>
  );
}
