import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function NewProducts({ newProducts }) {
  return (
    <div>
      <h1 className="text-2xl text-center mb-10">Newly Added Products</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {newProducts.length > 0 &&
          newProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
}
