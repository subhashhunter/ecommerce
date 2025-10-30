"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditproductPage(){
    const router=useRouter()
    const params=useParams()
    const productId=params.id as string

    const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    image: "",
    inventory: ""
  });
  const [loading,setLoading]=useState(true)
   const [error, setError] = useState("");

   useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        const product = data.products.find((p: any) => p._id === productId);
        if (!product) {
          setError("Product not found");
          return;
        }
        setForm({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          image: product.image,
          inventory: product.inventory.toString()
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load product");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate=async(e:React.FormEvent)=>{
    e.preventDefault()

    const token=localStorage.getItem("adminToken")
     if (!token) {
      alert("Unauthorized");
      router.push("/admin/login");
      return;
    }
    const res=await fetch(`/api/products/${productId}`,{
        method:"PUT",
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
        inventory: Number(form.inventory)
      }),
    })
    if (res.ok) {
      alert("Product updated successfully");
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

   if (loading) return <p className="p-6">Loading product...</p>;
   if (error) return <p className="text-red-600 p-6">{error}</p>;

    return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input name="name" value={form.name} onChange={handleChange}
          placeholder="Product Name" className="w-full border p-2 rounded" />

        <input name="slug" value={form.slug} onChange={handleChange}
          placeholder="Slug" className="w-full border p-2 rounded" />

        <textarea name="description" value={form.description} onChange={handleChange}
          placeholder="Description" className="w-full border p-2 rounded" />

        <input name="price" type="number" value={form.price} onChange={handleChange}
          placeholder="Price" className="w-full border p-2 rounded" />

        <input name="category" value={form.category} onChange={handleChange}
          placeholder="Category" className="w-full border p-2 rounded" />

        <input name="image" value={form.image} onChange={handleChange}
          placeholder="Image URL" className="w-full border p-2 rounded" />

        <input name="inventory" type="number" value={form.inventory} onChange={handleChange}
          placeholder="Inventory" className="w-full border p-2 rounded" />

        <button type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Product
        </button>
      </form>
    </div>
  );
}