export default function OrderLine({ _id, createdAt, line_items, paid }) {
  //format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //calculate the total of the order
  const calculateTotal = (items) => {
    return items.reduce(
      (total, item) =>
        total + item.quantity * (item.price_data.unit_amount / 100),
      0
    );
  };

  const total = calculateTotal(line_items);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold">Order #{_id}</h2>
          <p className="text-sm text-gray-600">
            Placed on {formatDate(createdAt)}
          </p>
        </div>
        <div>
          <span
            className={`px-4 py-1 rounded-full text-sm ${
              paid ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            }`}
          >
            {paid ? "Paid" : "Unpaid"}
          </span>
        </div>
      </div>
      <div>
        <ul>
          {line_items.map((item, index) => (
            <li key={index} className="flex justify-between my-1">
              <span>
                {item.quantity} x {item.price_data.product_data.name}
              </span>
              <span>{(item.price_data.unit_amount / 100).toFixed(2)} PLN</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2 font-semibold">Total: {total.toFixed(2)} PLN</div>
    </div>
  );
}
