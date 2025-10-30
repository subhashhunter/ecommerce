"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
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
      
        fetchStats();
      }
    };

    const fetchStats = async () => {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setStats(data);
      setLoading(false);
    };

    verifyAdmin();
  }, [router]);

  if (loading) return <p className="text-center p-6">Loading Dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Dashboard</h1>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Inventory</h2>
          <p className="text-2xl font-bold">{stats.totalInventory}</p>
        </div>

        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Low Stock Products</h2>
          <p className="text-2xl font-bold text-red-500">{stats.lowStockCount}</p>
        </div>
      </div>

      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Low Stock Details</h2>
        {stats.lowStockCount === 0 ? (
          <p className="text-green-600">🎉 All products are well-stocked</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Inventory</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStockProducts.map((p: any) => (
                <tr key={p._id}>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border text-red-600">{p.inventory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
