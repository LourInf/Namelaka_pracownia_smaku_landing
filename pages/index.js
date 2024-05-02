import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Wishlist } from "@/models/Wishlist";
import Products from "@/pages/products";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home({
  featuredProduct,
  newProducts,
  products,
  wishedNewProducts,
}) {
  //console.log(featuredProduct); // if we have  product: JSON.stringify(product) we receive a string. To convert to object we need to parse it: JSON.parse(...)
  //console.log(newProducts)
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts
        newProducts={newProducts}
        wishedProducts={wishedNewProducts}
      />
      <Products products={products} />
    </div>
  );
}

//getServerSideProps: runs on the server each time the page is requested to fetch data that's needed for the initial render of the page
export async function getServerSideProps(context) {
  await mongooseConnect();

  // Fetch products that all users should see regardless of authentication state
  const featuredProduct = await Product.findById("660e928e219466e7c53f0731");
  const newProducts = await Product.find({}).sort({ _id: -1 }).limit(5);
  const products = await Product.find({});

  // retrieve session information
  const { user } = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // Initialize wishedProductIds as an empty array for non-loggedin users
  let wishedProductIds = [];

  // If a user is logged in, fetch their wishlist
  if (user) {
    const wishlist = await Wishlist.findOne({ userEmail: user.email }).lean();
    if (wishlist && wishlist.products) {
      wishedProductIds = wishlist.products.map((id) => id.toString());
    }
  }

  // Return all fetched products and the wishlist info (if available) to the client
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      products: JSON.parse(JSON.stringify(products)),
      wishedNewProducts: wishedProductIds,
    },
  };
}
