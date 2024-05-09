import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import Image from "next/image";
import Link from "next/link";

export default function Categories({ mainCategories }) {
  // console.log(categoryProducts);
  return (
    <div className="bg-custom-pink">
      <h1 className="text-2xl text-center mt-20 mb-4">Categories</h1>
      <div className="flex flex-col items-center gap-8">
        {mainCategories &&
          mainCategories.map((cat) => (
            <div key={cat._id} className="w-full">
              <div className="flex mb-4">
                <h2 className="text-2xl font-bold">{cat.name}</h2>
                {cat.images && cat.images.length > 0 && (
                  <img
                    src={cat.images[0]}
                    alt={cat.name}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50px",
                    }}
                  />
                )}
                <Link
                  href={"/category/" + cat._id}
                  className="ml-4 mt-1.5 underline underline-offset-4 text-blue-500 hover:text-blue-700"
                >
                  Show all
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  // 1. Fetch all categories from the database
  const categories = await Category.find();
  // 2. Filter to get only main categories (no parent)
  const mainCategories = categories.filter((c) => !c.parent);

  // Return fetched data as props
  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
    },
  };
}
