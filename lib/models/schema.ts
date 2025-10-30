import mongoose, { Schema, model, models } from "mongoose";

export interface IAdmin {
  name: string;
  username: string;
  password: string;
  role?: "admin";
  createdAt?: Date;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inventory: number;
  lastUpdated?: Date;
}

// Admin Schema
const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: () => new Date() },
});

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  inventory: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});


export const Admin = models?.Admin || model<IAdmin>("Admin", AdminSchema,"admin");
export const Product = models?.Product || model<IProduct>("Product", productSchema);
