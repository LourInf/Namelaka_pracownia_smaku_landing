import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";

export default function Categories({ mainCategories, categoryProducts }) {
  //categoryProducts is an object where key is catId and it has an array of products
  // console.log(categoryProducts);
  return (
    <>
      <h1 className="text-2xl text-center mt-60">Categories</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {mainCategories &&
          mainCategories.map((cat) => (
            <div key={cat._id}>
              <h2>{cat.name}</h2>
              <div>
                {categoryProducts[cat._id] &&
                  categoryProducts[cat._id].map((p) => (
                    <div key={p._id}>{p.title}</div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const categories = await Category.find();
  const mainCategories = categories.filter((c) => !c.parent);

  const categoryProducts = {};

  for (const mainCat of mainCategories) {
    // Fetch child categories
    const childCategories = categories.filter(
      (cat) => cat.parent && cat.parent.toString() === mainCat._id.toString()
    );

    const categoryIds = [mainCat._id, ...childCategories.map((cat) => cat._id)];

    // Fetch products for both parent and child categories
    const products = await Product.find(
      {
        category: {
          $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
      null,
      { limit: 3, sort: { _id: -1 } }
    );

    categoryProducts[mainCat._id] = products;
    console.log(`Products for category ${mainCat._id}:`, products);
  }

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoryProducts: JSON.parse(JSON.stringify(categoryProducts)),
    },
  };
}
