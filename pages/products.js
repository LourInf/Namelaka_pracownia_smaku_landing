import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Wishlist } from "@/models/Wishlist";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Products({ products, wishedProducts }) {
  return (
    <>
      <header>
        <h1 className="text-2xl text-center mt-60">All Products</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {products?.length > 0 &&
            products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                wishedProducts={wishedProducts}
              />
            ))}
        </div>
      </header>
    </>
  );
}

// getServerSideProps function only runs on the server for every request to the page
export async function getServerSideProps(context) {
  // First we connect to db
  await mongooseConnect();
  // Find all products in the database and sort them by the newest first based on their _id value
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  // Return the list of products as a prop to the React component to render

  // retrieve session information
  const session = await getServerSession(context.req, context.res, authOptions);

  // Initialize wishedProductIds as an empty array for non-loggedin users
  let wishedProductIds = [];

  // If a user is logged in, fetch their wishlist
  if (session?.user) {
    const wishlist = await Wishlist.findOne({
      userEmail: session.user.email,
    }).lean();
    if (wishlist && wishlist.products) {
      wishedProductIds = wishlist.products.map((id) => id.toString());
    }
  }

  // Return all fetched products and the wishlist info (if available) to the client
  return {
    props: {
      // Convert the products from MongoDB format to a JSON string and back to JSON to ensure
      // compatibility with Next.js data requirements (MongoDB ObjectId is not serializable)
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProductIds,
    },
  };
}
