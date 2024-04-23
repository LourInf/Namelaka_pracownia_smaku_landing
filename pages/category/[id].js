import { Category } from "@/models/Category";
import Products from "../products";
import { Product } from "@/models/Product";
import ProductCard from "@/components/ProductCard";

export default function CategoryPage({ category, products }) {
  return (
    <>
      <h1 className="text-2xl text-center mt-60 mb-4">{category?.name}</h1>
      <div className="grid grid-cols-5 gap-4">
        {products &&
          products.length > 0 &&
          products.map(
            (product) =>
              product && <ProductCard key={product._id} product={product} />
          )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const category = await Category.findById(context.query.id);
  const subCategories = await Category.find({ parent: category._id });
  const catIds = [category._id, ...subCategories.map((c) => c._id)];
  const products = await Product.find({ category: catIds });
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
