

import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/mongodb";
import Category from "@/models/Category";
 

const DEFAULT_CATEGORIES = [
  { name: "Burgers", slug: "burgers" },
  { name: "Juicy & Fresh", slug: "juicy-fresh" },
  { name: "Rices", slug: "rices" },
  { name: "Chicken Fries", slug: "chicken-fries" },
  { name: "Pizza", slug: "pizza" },
  { name: "French-fries", slug: "french-fries" },
];
 
export async function GET() {
  try {
    await dbConnect();
 
    const count = await Category.countDocuments();
 
    if (count === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
    }
 
    const categories = await Category.find().sort({ name: 1 });
 
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json(
      { error: "ক্যাটাগরি লোড করা যায়নি" },
      { status: 500 }
    );
  }
}
 
