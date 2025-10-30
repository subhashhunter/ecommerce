import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/schema";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, description, price, category, image, inventory } = body;

    if (!name || !slug || !description || !price || !category || !image || inventory == null) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectDB()

    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Product with this slug already exists" }, { status: 400 });
    }

    const newProduct = await Product.create({
      name,
      slug,
      description,
      price,
      category,
      image,
      inventory
    });

    return NextResponse.json({ message: "Product added successfully", product: newProduct }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(){
    try {
        await connectDB()
        const products=await Product.find({})
        return NextResponse.json({products},{status:200})
    } catch (error) {
       console.error("Error fetching products:", error);
       return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 }); 
    }
}