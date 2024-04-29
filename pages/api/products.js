import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

//This handler processes GET requests where query parameters = categories to filter by + any other filters applicable to the properties field of the products. It constructs a query object based on these parameters and fetches the relevant products from the database.

export default async function handler(req, res) {
  await mongooseConnect();
  const { categories, sort, phrase, ...filters } = req.query; // Destructure 'categories' and the rest of the filters from the request query parameters. Added sort, phrase,..
  //   console.log({ sort });
  let [sortField, sortOrder] = (sort || "_id-desc").split("-");

  // Initialize category filter only if 'categories' parameter exists and is not empty
  const categoryArray = categories ? categories.split(",") : [];

  const queryObject = {};
  if (categoryArray.length > 0) {
    queryObject.category = { $in: categoryArray };
  } // Create a query object to find products with categories that match any in the provided list
  // For each filter, use dot notation to query inside the properties object
  // Iterate over each filter in the filters object
  Object.keys(filters).forEach((key) => {
    // If the filter value isn't 'all' (all=no filters)
    // add a property to the query object to filter by this key within the 'properties' object of the Product schema
    if (filters[key] !== "all") {
      queryObject[`properties.${key}`] = filters[key];
    }
  });

  if (phrase) {
    queryObject["$or"] = [
      { title: { $regex: phrase, $options: "i" } },
      { description: { $regex: phrase, $options: "i" } },
    ];
  }
  //   console.log("Query Object:", queryObject);
  try {
    const products = await Product.find(queryObject, null, {
      sort: { [sortField]: sortOrder === "desc" ? -1 : 1 },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
} // Use the Product model to find all products that match the query object and return them as JSON
