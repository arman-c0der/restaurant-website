import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/mongodb";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// slug generate করার helper
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET all products
export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({ available: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Products GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load products",
      },
      { status: 500 }
    );
  }
}

// CREATE new product
export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const category = formData.get("category");
    const description = formData.get("description");
    const tag = formData.get("tag");
    const time = formData.get("time");
    const imageFile = formData.get("image");

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Name, price and category are required" },
        { status: 400 }
      );
    }

    if (!imageFile || typeof imageFile !== "object" || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Product image is required" },
        { status: 400 }
      );
    }

    // Cloudinary-তে image upload
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    });

    // Name থেকে unique slug generate
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProduct = await Product.create({
      name,
      slug,
      price: Number(price),
      category,
      description,
      tag,
      time,
      image: uploadResult.secure_url,
      isAvailable: true,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}