"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Archive,
} from "lucide-react";

import { getDashboardStats } from "@/app/actions/stats";

// Recharts Components-ke Dynamic Import (ssr: false) kora hoyeche
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false }
);
const Line = dynamic(
  () => import("recharts").then((mod) => mod.Line),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false }
);
const Bar = dynamic(
  () => import("recharts").then((mod) => mod.Bar),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
);

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        if (res.success) setStats(res.data);
        else console.error(res.error);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Revenue",
      value: stats ? `৳${stats.totalRevenue.toLocaleString()}` : "—",
      icon: DollarSign,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? "—",
      icon: ShoppingCart,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts ?? "—",
      icon: Package,
      accent: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total Customers",
      value: stats?.totalCustomers ?? "—",
      icon: Users,
      accent: "bg-orange-50 text-orange-600",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? "—",
      icon: Clock,
      accent: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Completed Orders",
      value: stats?.completedOrders ?? "—",
      icon: CheckCircle2,
      accent: "bg-green-50 text-green-600",
    },
    {
      label: "Cancelled Orders",
      value: stats?.cancelledOrders ?? "—",
      icon: XCircle,
      accent: "bg-red-50 text-red-600",
    },
    {
      label: "Today's Orders",
      value: stats?.todaysOrders ?? "—",
      icon: CalendarDays,
      accent: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Carts",
      value: stats?.totalCarts ?? "—",
      icon: Archive,
      accent: "bg-pink-50 text-pink-600",
    },
  ];

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-10"
    >
      <h1 className="text-2xl font-bold text-black">
        Welcome{session?.user?.name ? `, ${session.user.name}` : ""} 👋
      </h1>
      <p className="mt-1 text-sm text-black/50">
        Manage products, categories, and orders from here.
      </p>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat, i) => (
          <m.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-black">
                  {loading ? (
                    <span className="inline-block h-7 w-16 animate-pulse rounded bg-black/10" />
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="mt-1 text-sm text-black/50">{stat.label}</p>
              </div>
              <div className={`rounded-xl p-2.5 ${stat.accent}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </m.div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm min-h-[320px]"
        >
          <h3 className="text-sm font-semibold text-black mb-4">
            📈 Revenue (Last 7 days)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#059669"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm min-h-[320px]"
        >
          <h3 className="text-sm font-semibold text-black mb-4">
            📊 Orders (Last 7 days)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </m.div>
      </div>
    </m.div>
  );
}