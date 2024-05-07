import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Wishlist } from "@/models/Wishlist";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Categories({
  mainCategories,
  categoryProducts,
  wishedProducts,
}) {
  // console.log(categoryProducts);
  return (
    <>
      <h1 className="text-2xl text-center mt-60 mb-4">Categories</h1>
      <div className="flex flex-col items-center gap-8">
        {mainCategories &&
          mainCategories.map((cat) => (
            <div key={cat._id} className="w-full">
              <div className="flex mb-4">
                <h2 className="text-2xl font-bold">{cat.name}</h2>
                <Link
                  href={"/category/" + cat._id}
                  className="ml-4 mt-1.5 underline underline-offset-4 text-blue-500 hover:text-blue-700"
                >
                  Show all
                </Link>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-4">
                {categoryProducts[cat._id] &&
                  categoryProducts[cat._id].map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      wishedProducts={wishedProducts}
                    />
                  ))}
                <Link
                  href={"/category/" + cat._id}
                  className="bg-gray-200 w-60 h-96 rounded-lg text-center flex items-center justify-center hover:text-blue-700"
                >
                  Show all
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-6 h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  // 1. Fetch all categories from the database
  const categories = await Category.find();
  // 2. Filter to get only main categories (no parent)
  const mainCategories = categories.filter((c) => !c.parent);
  // 3. Initialize an object to store products associated with each category
  const categoryProducts = {};
  // 4. Loop through each main category to fetch related products
  for (const mainCat of mainCategories) {
    // Convert main category ID to string for comparison
    const mainCatId = mainCat._id.toString();
    // Find all child categories IDs by comparing their parent field to main category ID
    const childCatIds = categories
      .filter((cat) => cat?.parent?.toString() === mainCatId)
      .map((cat) => cat._id.toString());
    // Prepare array of IDs (main and its children) for product query
    const categoriesIds = [mainCatId, ...childCatIds];
    // console.log(categoriesIds);
    // Fetch products linked to both main and child categories
    const products = await Product.find({ category: categoriesIds }, null, {
      limit: 3, // Limit the number of products fetched
      sort: { _id: -1 }, // Sort products by latest
    });
    // Store the products array under the respective category ID
    categoryProducts[mainCat._id] = products;
  }

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

  // Return fetched data as props and the wishlist info (if available) to the client
  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoryProducts: JSON.parse(JSON.stringify(categoryProducts)),
      wishedProducts: wishedProductIds,
    },
  };
}
