import { NextResponse } from "next/server";
import mongoose from "mongoose";
import {dbConnect} from "@/lib/mongodb";
import Order from "@/models/Order";
import { authOptions } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const session = await authOptions();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const User = mongoose.model("User");

    const user = await User.findOne({
      email: session.user.email,
    });

    const order = await Order.findOne({
      _id: id,
      userId: user._id,
    }).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order Details Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load order",
      },
      { status: 500 }
    );
  }
}