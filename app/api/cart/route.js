import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { dbConnect } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";

import User from "@/models/User";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

async function getSession() {
  return await getServerSession(authOptions);
}

// =========================
// GET CART
// =========================
export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const cart = await Cart.findOne({
      userId: user._id,
    }).lean();

    if (!cart) {
      return NextResponse.json({
        success: true,
        items: [],
      });
    }

    const items = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId).lean();

      if (product) {
        items.push({
          productId: product._id.toString(),
          name: product.name,
          image: product.image,
          price: product.price,
          available: product.available,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        });
      }
    }

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("Cart GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load cart",
      },
      { status: 500 }
    );
  }
}

// =========================
// ADD TO CART
// =========================
export async function POST(request) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId = body.productId;
    const quantity = Number(body.quantity || 1);

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be at least 1",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    if (!product.available) {
      return NextResponse.json(
        {
          success: false,
          message: "Product is unavailable",
        },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({
      userId: user._id,
    });

    // Create cart if user doesn't have one
    if (!cart) {
      cart = new Cart({
        userId: user._id,
        items: [
          {
            productId: product._id,
            quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId.toString()
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId: product._id,
          quantity,
        });
      }
    }

    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Added to cart successfully",
        cartId: cart._id.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cart POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add to cart",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE CART
// =========================
export async function PATCH(request) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    const newQuantity = Number(quantity);

    await dbConnect();

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const cart = await Cart.findOne({
      userId: user._id,
    });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
        },
        { status: 404 }
      );
    }

    // Quantity 0 means remove
    if (newQuantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId.toString()
      );
    } else {
      const item = cart.items.find(
        (item) => item.productId.toString() === productId.toString()
      );

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            message: "Product is not in cart",
          },
          { status: 404 }
        );
      }

      item.quantity = newQuantity;
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error("Cart PATCH Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update cart",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE CART ITEM
// =========================
export async function DELETE(request) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const cart = await Cart.findOne({
      userId: user._id,
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        message: "Cart already empty",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Item removed successfully",
    });
  } catch (error) {
    console.error("Cart DELETE Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove item",
      },
      { status: 500 }
    );
  }
}