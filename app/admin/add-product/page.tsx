"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    image: "",
    inventory: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Not authorized");
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          price: Number(form.price), 
          category: form.category,
          image: form.image,
          inventory: Number(form.inventory),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product added successfully");
        router.push("/admin");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Add New Product</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          placeholder="Product Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="slug"
          placeholder="Product Slug (unique)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="image"
          placeholder="Image URL"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="inventory"
          placeholder="Inventory"
          type="number"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
