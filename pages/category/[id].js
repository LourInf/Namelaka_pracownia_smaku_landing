import { Category } from "@/models/Category";
import Products from "../products";
import { Product } from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoryPage({
  category,
  subCategories,
  products: originalProducts,
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

  const [sort, setSort] = useState("price_asc");

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
    });
  }, [filtersValues, sort]);

  return (
    <>
      <h1 className="text-2xl text-center mt-60 mb-4">{category?.name}</h1>
      <div className="flex flex-row gap-6 justify-center mb-4">
        {category && category.properties && category.properties.length > 0 ? (
          category.properties.map((prop) => (
            <div key={prop.name} className="bg-slate-300 rounded-md pl-2">
              <label htmlFor={prop.name}>{prop.name}:</label>
              <select
                id={prop.name}
                value={filtersValues.find((f) => f.name === prop.name).value}
                onChange={(e) => handleFilterChange(prop.name, e.target.value)}
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
      </div>
      <div>
        <span>Sort by</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="price_asc">Price, lowest first</option>
          <option value="price_desc">Price, highest first</option>
        </select>
      </div>
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
  //   console.log("Category data:", category);
  const subCategories = await Category.find({ parent: category._id });
  const catIds = [category._id, ...subCategories.map((c) => c._id)];
  const products = await Product.find({ category: catIds });
  //   console.log("Products data:", products);
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
    },
  };
}
