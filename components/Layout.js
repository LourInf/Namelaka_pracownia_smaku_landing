import Link from "next/link";

export default function Layout({ children, categories }) {
  return (
    <div className="flex w-full min-h-screen bg-custom-pink">
      {/* Vertical menu for categories */}
      <div className="relative w-64 p-5 sticky top-0 h-screen mt-20 pt-8 pl-14 ml-20 mb-20">
        <div className="absolute inset-0 bg-menu-bg bg-cover opacity-20 rounded-lg"></div>
        {/* Pseudo-element for background */}
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-3">
            <Link href="/categories">Categories</Link>
          </h2>
          <ul>
            <li>
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-800"
              >
                Show all products
              </Link>
            </li>
            {categories &&
              categories.map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/category/${category._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
