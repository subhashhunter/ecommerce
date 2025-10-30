import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/schema";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { id } =await params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...body, lastUpdated: Date.now() },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
