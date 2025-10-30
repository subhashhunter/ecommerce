"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        fetchProducts();
      }
    };

    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products);
      setLoading(false);
    };

    verifyAdmin();
  }, [router]);

  if (loading) return <p className="text-center p-6">Loading Products...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Product Management</h1>

      <button
        onClick={() => router.push("/admin/add-product")}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        + Add New Product
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-amber-600">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Inventory</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: any) => (
            <tr key={product._id}>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">{product.price}</td>
              <td className="p-2 border">{product.inventory}</td>
              <td className="p-2 border">
                <button
                  onClick={() => router.push(`/admin/edit-product/${product._id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
                >
                  Edit
                </button>
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
