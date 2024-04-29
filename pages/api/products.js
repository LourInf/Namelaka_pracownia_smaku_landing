import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

//This handler processes GET requests where query parameters = categories to filter by + any other filters applicable to the properties field of the products. It constructs a query object based on these parameters and fetches the relevant products from the database.

export default async function handler(req, res) {
  await mongooseConnect();
  const { categories, sort, ...filters } = req.query; // Destructure 'categories' and the rest of the filters from the request query parameters. Added sort
  //   console.log({ sort });
  const [sortField, sortOrder] = sort.split("-");
  const queryObject = { category: { $in: categories.split(",") } }; // Create a query object to find products with categories that match any in the provided list
  // For each filter, use dot notation to query inside the properties object
  // Iterate over each filter in the filters object
  Object.keys(filters).forEach((key) => {
    // If the filter value isn't 'all' (all=no filters)
    // add a property to the query object to filter by this key within the 'properties' object of the Product schema
    if (filters[key] !== "all") {
      queryObject[`properties.${key}`] = filters[key];
    }
  });

  //   console.log("Query Object:", queryObject);
  res.json(
    await Product.find(queryObject, null, {
      sort: { [sortField]: sortOrder == "desc" ? -1 : 1 },
    })
  ); // Use the Product model to find all products that match the query object and return them as JSON
}
