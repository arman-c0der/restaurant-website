import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { dbConnect } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";

import User from "@/models/User";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";

async function getSession() {
  return await getServerSession(authOptions);
}
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

    const {
      name,
      phone,
      address,
      paymentMethod = "cod",
    } = body;

    if (!name || !phone || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, phone and address are required",
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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty",
        },
        { status: 400 }
      );
    }

    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.productId);

      if (!product || !product.available) {
        continue;
      }

      const itemSubtotal = product.price * cartItem.quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,
      });
    }

    if (orderItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No available products in cart",
        },
        { status: 400 }
      );
    }

    const deliveryFee = subtotal >= 50 ? 0 : 3;

    const tax = Number((subtotal * 0.05).toFixed(2));

    const total = Number(
      (subtotal + deliveryFee + tax).toFixed(2)
    );

    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,

      userId: user._id,

      customer: {
        name,
        email: user.email,
        phone,
        address,
      },

      items: orderItems,

      subtotal,
      deliveryFee,
      tax,
      total,

      paymentMethod,

      paymentStatus:
        paymentMethod === "cod" ? "pending" : "pending",

      orderStatus: "pending",
    });

    // Empty cart after successful order
    cart.items = [];
    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
      },
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to place order",
      },
      { status: 500 }
    );
  }
}

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

    const User = mongoose.model("User");

    const user = await User.findOne({
      email: session.user.email,
    });

    const orders = await Order.find({
      userId: user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Orders GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load orders",
      },
      { status: 500 }
    );
  }
}