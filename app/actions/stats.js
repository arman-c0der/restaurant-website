"use server";

import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Cart from "@/models/Cart";

export async function getDashboardStats() {
  try {
    await dbConnect();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      revenueAgg,
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      todaysOrders,
      totalCarts,
      last7DaysOrders,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "completed" }),
      Order.countDocuments({ orderStatus: "cancelled" }),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Cart.countDocuments(),
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return {
      success: true,
      data: {
        totalRevenue: revenueAgg[0]?.total || 0,
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        todaysOrders,
        totalCarts,
        chartData: last7DaysOrders.map((d) => ({
          date: d._id,
          revenue: d.revenue,
          orders: d.orders,
        })),
      },
    };
  } catch (error) {
    console.error("Stats action error:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}