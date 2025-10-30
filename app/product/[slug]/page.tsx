export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const res = await fetch(`http://localhost:3000/api/product/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="p-6 text-center text-red-500">Product not found</div>;
  }

  const data = await res.json();
  const product = data.product;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="border rounded-lg shadow p-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">₹{product.price}</p>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
            {product.category}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          Inventory: {product.inventory} | Last Updated:{" "}
          {new Date(product.lastUpdated).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
