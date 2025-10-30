import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/schema";


export async function GET() {
  await connectDB();
  const products = await Product.find({});
  const totalProducts = products.length;
  const totalInventory = products.reduce((sum, p) => sum + p.inventory, 0);
  const lowStockProducts = products.filter((p) => p.inventory < 5);

  return NextResponse.json({
    totalProducts,
    totalInventory,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
  });
}
