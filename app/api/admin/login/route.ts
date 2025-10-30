import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Admin } from "@/lib/models/schema";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    console.log("Received username:", username);
    console.log("Received password:", password);
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    await connectDB();

    const admin = await Admin.findOne({ username:username.trim(), password:password.trim() }); 
    if (!admin) {
      
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

 
    return NextResponse.json({ message: "Login Successful", token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
