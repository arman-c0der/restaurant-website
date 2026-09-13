import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

import Product from "@/models/Product";
import Category from "@/models/Category";

// slug generate করার helper function
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // special characters বাদ
    .replace(/\s+/g, "-") // space কে dash দিয়ে replace
    .replace(/-+/g, "-"); // multiple dash কে single dash
}

export async function POST(request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "এই কাজটি করার অনুমতি আপনার নেই" },
        { status: 403 }
      );
    }

    // Get multipart/form-data
    const formData = await request.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const category = formData.get("category");
    const description = formData.get("description");
    const tag = formData.get("tag");
    const time = formData.get("time");

    const imageFile = formData.get("image");

    // -------------------------
    // Validation
    // -------------------------

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "প্রোডাক্টের নাম দিতে হবে" },
        { status: 400 }
      );
    }

    if (
      price === undefined ||
      price === "" ||
      isNaN(price) ||
      Number(price) <= 0
    ) {
      return NextResponse.json(
        { error: "সঠিক দাম (Price) দিতে হবে" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category সিলেক্ট করা আবশ্যক" },
        { status: 400 }
      );
    }

    // Check image exists
    if (!imageFile || typeof imageFile.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "প্রোডাক্টের ছবি আপলোড করতে হবে" },
        { status: 400 }
      );
    }

    // -------------------------
    // Image validation
    // -------------------------

    if (!imageFile.type?.startsWith("image/")) {
      return NextResponse.json(
        { error: "শুধু image file upload করা যাবে" },
        { status: 400 }
      );
    }

    // Maximum 4MB
    if (imageFile.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 4MB" },
        { status: 400 }
      );
    }

    // -------------------------
    // Connect MongoDB
    // -------------------------

    await dbConnect();

    // -------------------------
    // Check category
    // -------------------------

    const categoryExists = await Category.findOne({
      slug: category,
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "সিলেক্ট করা ক্যাটাগরিটি খুঁজে পাওয়া যায়নি" },
        { status: 400 }
      );
    }

    // -------------------------
    // Generate unique slug from name
    // -------------------------

    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // -------------------------
    // Convert File → Buffer
    // -------------------------

    const arrayBuffer = await imageFile.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    // -------------------------
    // Upload to Cloudinary
    // -------------------------

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "restaurant/products",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    // Cloudinary secure URL
    const imageUrl = uploadResult.secure_url;

    // -------------------------
    // Create Product
    // -------------------------

    const newProduct = await Product.create({
      name: name.trim(),
      slug,
      price: Number(price),
      category,
      image: imageUrl,
      description: description?.trim() || "",
      tag: tag?.trim() || "",
      time: time?.trim() || "",
    });

    // -------------------------
    // Response
    // -------------------------

    return NextResponse.json(
      {
        message: "প্রোডাক্ট সফলভাবে যোগ হয়েছে",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("========== CREATE PRODUCT ERROR ==========");
    console.error(error);
    console.error("==========================================");

    return NextResponse.json(
      {
        error: error?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");

    const query = category ? { category } : {};

    const products = await Product.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Fetch products error:", error);

    return NextResponse.json(
      {
        error: "প্রোডাক্ট লোড করা যায়নি",
      },
      { status: 500 }
    );
  }
}