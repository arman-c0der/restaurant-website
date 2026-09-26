// actions/getProducts.js
"use server";

import { dbConnect } from "../../lib/mongodb";
import Product from "../../models/Product";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

const PAGE_SIZE = 10;

export async function getProductsByCategory(category) {
  await dbConnect();
  const products = await Product.find({ category })
    .select("name price image tag time rating available")
    .limit(20)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProducts({ search = "", category = "", page = 1 } = {}) {
  try {
    await dbConnect();

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const skip = (page - 1) * PAGE_SIZE;

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        products: JSON.parse(JSON.stringify(products)),
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        totalCount,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("getProducts error:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function getCategoriesList() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(categories)) };
  } catch (error) {
    console.error("getCategoriesList error:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function toggleProductAvailability(id, isAvailable) {
  try {
    await dbConnect();
    await Product.findByIdAndUpdate(id, { isAvailable });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("toggleProductAvailability error:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id) {
  try {
    await dbConnect();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("deleteProduct error:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function getProductById(id) {
  try {
    await dbConnect();

    if (!id) {
      return { success: false, error: "Invalid product ID" };
    }

    const product = await Product.findById(id)
      .populate("category", "name")
      .lean();

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return {
      success: true,
      product: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.error("getProductById error:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}