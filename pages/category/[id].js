import Products from "../products";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Wishlist } from "@/models/Wishlist";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import Layout from "@/components/Layout";

export default function CategoryPage({
  category,
  subCategories,
  products: originalProducts,
  wishedProducts,
  mainCategories,
}) {
  //the initial state should be an object where we have as key the property name and  as value "all"
  const [products, setProducts] = useState(originalProducts);
  const [filtersValues, setFiltersValues] = useState(
    category.properties.map((p) => ({
      name: p.name,
      value: "all",
    }))
  );
  //   console.log("filtersValues: ", filtersValues);

  const [sort, setSort] = useState("_id-desc");
  const [loading, setLoading] = useState(false);

  function handleFilterChange(filterName, filterValue) {
    setFiltersValues((prev) => {
      const newValue = prev.map((p) => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }));
      return newValue;
    });
  }

  useEffect(() => {
    setFiltersValues(
      category.properties.map((p) => ({
        name: p.name,
        value: "all",
      }))
    );
  }, [category]);

  useEffect(() => {
    setLoading(true);
    const catIds = [category._id, ...(subCategories?.map((c) => c._id) || [])];
    // console.log(catIds);
    const params = new URLSearchParams();
    params.set("categories", catIds.join(",")); //for filtering
    params.set("sort", sort); //for sorting
    filtersValues.forEach((f) => {
      if (f.value !== "all") {
        params.set(f.name, f.value);
      }
    });
    const url = `/api/products?` + params.toString();
    axios.get(url).then((res) => {
      //   console.log(res.data);
      setProducts(res.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  }, [filtersValues, sort]);

  function resetFiltersAndSort() {
    setFiltersValues(
      category.properties.map((p) => ({
        name: p.name,
        value: "all",
      }))
    );
    setSort("price_asc");
  }

  return (
    <Layout categories={mainCategories}>
      <div className="bg-custom-pink px-40">
        <h1 className="text-2xl text-center mt-20 mb-4">{category?.name}</h1>
        <div className="flex flex-row gap-6 justify-center mb-4">
          {category && category.properties && category.properties.length > 0 ? (
            category.properties.map((prop) => (
              <div key={prop.name} className="bg-slate-300 rounded-md pl-2">
                <label htmlFor={prop.name}>{prop.name}:</label>
                <select
                  id={prop.name}
                  value={
                    filtersValues.find((f) => f.name === prop.name)?.value ||
                    "all"
                  }
                  onChange={(e) =>
                    handleFilterChange(prop.name, e.target.value)
                  }
                  className="bg-transparent rounded-md border-none"
                >
                  <option value="all" className="bg-slate-200">
                    Show all
                  </option>
                  {prop.values.map((val) => (
                    <option key={val} value={val} className="bg-slate-200">
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            ))
          ) : (
            <p>No filters available.</p>
          )}

          <div className="bg-slate-300 rounded-md pl-2">
            Sort by:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent rounded-md border-none bg-slate-300"
            >
              <option value="price_asc" className="bg-slate-200">
                Price, lowest first
              </option>
              <option value="price_desc" className="bg-slate-200">
                Price, highest first
              </option>
              <option value="_id-desc">newest first</option>
              <option value="_id-asc">oldest first</option>
            </select>
          </div>
          <button
            onClick={resetFiltersAndSort}
            className="text-gold border border-gold hover:bg-gold hover:text-white py-2 px-4 rounded transition-colors"
          >
            Reset Filters
          </button>
        </div>
        {loading && (
          <div className="flex justify-center items-start pt-32 h-screen">
            <Spinner />
          </div>
        )}
        {!loading && (
          <div className="grid grid-cols-5 gap-4">
            {products &&
              products.length > 0 &&
              products.map(
                (product) =>
                  product && (
                    <ProductCard
                      key={product._id}
                      product={product}
                      wishedProducts={wishedProducts}
                    />
                  )
              )}
          </div>
        )}
        <div>
          {products.length === 0 && (
            <div className="pl-5">No Products found</div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const category = await Category.findById(context.query.id);
  //   console.log("Category data:", category);
  const subCategories = await Category.find({ parent: category._id });
  const catIds = [category._id, ...subCategories.map((c) => c._id)];
  const products = await Product.find({ category: catIds });
  const categories = await Category.find({ parent: null });
  //   console.log("Products data:", products);

  // retrieve session information
  const { user } =
    (await getServerSession(context.req, context.res, authOptions)) || {};

  // Initialize wishedProductIds as an empty array for non-loggedin users
  let wishedProductIds = [];

  // If a user is logged in, fetch their wishlist
  if (user) {
    const wishlist = await Wishlist.findOne({ userEmail: user.email }).lean();
    if (wishlist && wishlist.products) {
      wishedProductIds = wishlist.products.map((id) => id.toString());
    }
  }

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      wishedProducts: wishedProductIds,
      mainCategories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
