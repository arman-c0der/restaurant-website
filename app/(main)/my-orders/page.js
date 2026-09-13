"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Package, ArrowRight, Receipt } from "lucide-react";

const STATUS_STYLES = {
  pending: { bg: "#FBF3E7", text: "#8A6A2F", dot: "#C97A2B" },
  processing: { bg: "#FBF3E7", text: "#8A6A2F", dot: "#C97A2B" },
  out_for_delivery: { bg: "#EAF1EC", text: "#2F4A3D", dot: "#2F4A3D" },
  delivered: { bg: "#EAF1EC", text: "#2F4A3D", dot: "#2F4A3D" },
  cancelled: { bg: "#F7E9E5", text: "#93402A", dot: "#B3452C" },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: style.dot }}
      />
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();

        if (!data.success) {
          toast.error(data.message);
          return;
        }

        setOrders(data.orders || []);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#E7E2D8] border-t-[#C97A2B] animate-spin" />
          <p className="text-sm text-[#8A8377]">Loading your orders…</p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#FBF9F5] py-14"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap");
      `}</style>

      <div className="max-w-5xl mx-auto px-6">
        <h1
          className="text-[2.75rem] leading-none text-[#1F2420] mb-10"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
        >
          My orders
        </h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F1ECE2] flex items-center justify-center mb-5">
              <Receipt size={22} className="text-[#C97A2B]" />
            </div>
            <h2
              className="text-2xl text-[#1F2420] mb-2"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              No orders yet
            </h2>
            <p className="text-[#8A8377] mb-7 max-w-sm">
              When you place an order, it'll show up here so you can track it.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1F2420] text-white text-sm font-medium hover:bg-[#2F4A3D] transition-colors"
            >
              Browse menu
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-[#E7E2D8] bg-white overflow-hidden"
              >
                <div className="flex flex-col gap-4 px-7 py-5 border-b border-[#E7E2D8] bg-[#F7F4EC] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 ring-1 ring-[#E7E2D8]">
                      <Package size={16} className="text-[#C97A2B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8A8377]">Order</p>
                      <h2 className="font-medium text-[#1F2420]">
                        {order.orderNumber}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <StatusBadge status={order.orderStatus} />
                    <div className="text-right">
                      <p className="text-xs text-[#8A8377]">Total</p>
                      <p className="font-medium text-[#1F2420] tabular-nums">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-7 py-5 space-y-2.5">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-[#4A463F]"
                    >
                      <span>{item.name}</span>
                      <span className="text-[#8A8377]">× {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}