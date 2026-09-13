import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// GET single product
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // ← Next.js 16: params is a Promise

    const product = await Product.findById(id).populate("category", "name slug");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // ← এখানেও await

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const category = formData.get("category");
    const description = formData.get("description");
    const tag = formData.get("tag");
    const time = formData.get("time");
    const isAvailable = formData.get("isAvailable");
    const imageFile = formData.get("image");

    const updateData = {
      name,
      price: Number(price),
      category,
      description,
      tag,
      time,
      isAvailable: isAvailable === "true",
    };

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

      updateData.image = uploadResult.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // ← এখানেও await

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}