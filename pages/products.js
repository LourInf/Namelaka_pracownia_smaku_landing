import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function Products({ products }) {
  return (
    <>
      <header>
        <h1 className="text-2xl text-center mt-60">All Products</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {products?.length > 0 &&
            products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </header>
    </>
  );
}

// getServerSideProps function only runs on the server for every request to the page
export async function getServerSideProps() {
  // First we connect to db
  await mongooseConnect();
  // Find all products in the database and sort them by the newest first based on their _id value
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  // Return the list of products as a prop to the React component to render
  return {
    props: {
      // Convert the products from MongoDB format to a JSON string and back to JSON to ensure
      // compatibility with Next.js data requirements (MongoDB ObjectId is not serializable)
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
