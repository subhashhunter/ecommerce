"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  slug: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading products...</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p._id} className="border p-4 rounded shadow hover:shadow-lg transition">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-48 object-cover rounded mb-2"
          />
          <h2 className="font-bold text-lg">{p.name}</h2>
          <p className="text-gray-500 text-sm">{p.category}</p>
          <p className="font-semibold mt-2">₹{p.price}</p>
          <Link
            href={`/product/${p.slug}`}
            className="inline-block mt-3 bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

