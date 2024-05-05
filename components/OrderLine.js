export default function OrderLine({ line_items, createdAt }) {
  return (
    <div>
      <time>{createdAt}</time>
      {line_items.map((item) => (
        <div key={item.id}>
          {item.quantity} x {item.price_data.product_data.name}
        </div>
      ))}
    </div>
  );
}
