import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Wishlist } from "@/models/Wishlist";
import Products from "@/pages/products";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";
import { CarouselSetting } from "@/models/CarouselSetting";

export default function Home({
  featuredProduct,
  newProducts,
  products,
  wishedNewProducts,
  adText,
  subAdText,
  carouselImages,
}) {
  //console.log(featuredProduct); // if we have  product: JSON.stringify(product) we receive a string. To convert to object we need to parse it: JSON.parse(...)
  //console.log(newProducts)
  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-28 xl:px-40 py-1 bg-custom-pink">
      <Header carouselImages={carouselImages} />
      <NewProducts
        newProducts={newProducts}
        wishedProducts={wishedNewProducts}
      />
      <Featured
        product={featuredProduct}
        adText={adText}
        wishedProducts={wishedNewProducts}
        subAdText={subAdText}
      />
      <Products products={products} wishedProducts={wishedNewProducts} />
    </div>
  );
}

//getServerSideProps: runs on the server each time the page is requested to fetch data that's needed for the initial render of the page
export async function getServerSideProps(context) {
  await mongooseConnect();

  //fetch featured products
  const featuredProductSetting = await Setting.findOne({
    name: "featuredProductId",
  });
  let featuredProduct = null; //initialize them as null/empty
  let adText = "";
  let subAdText = "";
  if (featuredProductSetting) {
    featuredProduct = await Product.findById(featuredProductSetting.value);
    adText = featuredProductSetting.adText || "";
    subAdText = featuredProductSetting.subAdText || "";
  }
  // const featuredProduct = await Product.findById("660e928e219466e7c53f0731"); //hardcoded product
  const newProducts = await Product.find({}).sort({ _id: -1 }).limit(5);
  const products = await Product.find({});
  const carouselSettings = await CarouselSetting.findOne({
    name: "carouselImages",
  });
  const carouselImages = carouselSettings ? carouselSettings.images : [];

  // retrieve session information
  const session = await getServerSession(context.req, context.res, authOptions);

  // Initialize wishedProductIds as an empty array for non-loggedin users
  let wishedProductIds = [];

  // If a user is logged in, fetch their wishlist (If no user, then we will get the empty array of wished products)
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
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      products: JSON.parse(JSON.stringify(products)),
      wishedNewProducts: wishedProductIds,
      adText: adText,
      subAdText: subAdText,
      carouselImages,
    },
  };
}
