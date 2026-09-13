"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ArrowRight, ClipboardList } from "lucide-react";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[#FBF9F5] px-6 py-16"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap");
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg w-full text-center rounded-3xl border border-[#E7E2D8] bg-white p-10"
      >
        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
            delay: 0.15,
          }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2F4A3D]"
        >
          <Check className="h-7 w-7 text-white" strokeWidth={2.5} />
        </motion.div>

        <h1
          className="mt-6 text-3xl text-[#1F2420]"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
        >
          Order placed successfully!
        </h1>

        <p className="mt-3 text-[#8A8377]">
          Thank you for your order — we're getting it ready.
        </p>

        {orderNumber && (
          <div className="mt-7 rounded-2xl border border-dashed border-[#E7E2D8] bg-[#FBF9F5] p-4">
            <p className="text-xs text-[#8A8377]">Order number</p>
            <p
              className="mt-1 text-lg text-[#1F2420] tracking-wide"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              {orderNumber}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-8">
          <Link
            href="/menu"
            className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#1F2420] text-white text-sm font-medium transition-colors hover:bg-[#2F4A3D]"
          >
            Continue shopping
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/my-orders"
            className="flex items-center justify-center gap-2 py-3.5 rounded-full border border-[#E7E2D8] text-[#1F2420] text-sm font-medium transition-colors hover:bg-[#F7F4EC]"
          >
            <ClipboardList size={15} />
            View my orders
          </Link>
        </div>
      </motion.div>
    </main>
  );
}