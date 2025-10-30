
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/schema";
import Link from "next/link";

async function getProducts() {
  await connectDB();
  return Product.find();
}

export default async function Page() {
  const products = await getProducts();

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p._id.toString()} className="border p-4 rounded shadow">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-48 object-cover rounded mb-2"
          />
          <h2 className="font-bold">{p.name}</h2>
          <p className="text-gray-500 text-sm">{p.category}</p>
          <p className="font-semibold mt-2">₹{p.price}</p>
           <Link
            href={`/product/${p.slug}`}
            className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
