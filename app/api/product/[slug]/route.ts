import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/schema";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  { params }:  { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } =await params;

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
