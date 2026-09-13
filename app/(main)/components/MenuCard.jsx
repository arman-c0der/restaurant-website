"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Heart,
  Star,
  Clock,
  Leaf,
  Plus,
  Minus,
} from "lucide-react";

export function MenuCard({ item }) {
  const router = useRouter();

  const [qty, setQty] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // OPEN PRODUCT DETAILS
  // =========================
  function openDetails() {
    router.push(`/menu/${item._id}`);
  }

  // =========================
  // ADD TO CART
  // =========================
  async function addToCart(quantity = 1) {
    try {
      setLoading(true);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item._id,
          quantity,
        }),
      });

      const data = await res.json();

      // Not logged in
      if (res.status === 401) {
        toast.error("Please login first");
        router.push("/login");
        return false;
      }

      if (!data.success) {
        toast.error(data.message || "Failed to add to cart");
        return false;
      }

      toast.success("Added to cart");
      return true;
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // FIRST ADD
  // =========================
  async function handleAdd() {
    const success = await addToCart(1);

    if (success) {
      setQty(1);
    }
  }

  // =========================
  // INCREASE
  // =========================
  async function increaseQty() {
    const success = await addToCart(1);

    if (success) {
      setQty((q) => q + 1);
    }
  }

  // =========================
  // DECREASE
  // =========================
  async function decreaseQty() {
    if (qty <= 1) {
      try {
        setLoading(true);

        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item._id,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          toast.error(data.message || "Failed to remove item");
          return;
        }

        setQty(0);
        toast.success("Removed from cart");
      } catch (error) {
        console.error("Remove cart error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }

      return;
    }

    try {
      setLoading(true);

      const newQuantity = qty - 1;

      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item._id,
          quantity: newQuantity,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to update cart");
        return;
      }

      setQty(newQuantity);
    } catch (error) {
      console.error("Decrease quantity error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="flex flex-col border border-gray-300 rounded-3xl overflow-hidden"
    >
      {/* =========================
          IMAGE
      ========================= */}
      <div
        onClick={openDetails}
        className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#EFEDE6] cursor-pointer"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />

        {item.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {item.badge}
          </span>
        )}

        {/* Favourite */}
        <motion.button
          aria-label="Add to favourites"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <motion.span
            animate={{
              scale: liked ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`h-4 w-4 ${
                liked
                  ? "fill-black text-black"
                  : "text-black"
              }`}
            />
          </motion.span>
        </motion.button>
      </div>

      {/* =========================
          INFO
      ========================= */}
      <div
        onClick={openDetails}
        className="mt-4 flex items-start justify-between px-3 cursor-pointer"
      >
        <h3 className="text-base font-semibold text-black">
          {item.name}
        </h3>

        <span className="shrink-0 text-base font-semibold text-black">
          ${Number(item.price).toFixed(2)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-4 text-xs text-black/50 px-3">
        {item.tag && (
          <span className="flex items-center gap-1">
            <Leaf className="h-3.5 w-3.5" />
            {item.tag}
          </span>
        )}

        {item.time && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {item.time}
          </span>
        )}
      </div>

      {/* =========================
          BOTTOM
      ========================= */}
      <div className="mt-4 flex items-center justify-between px-3 pb-4">
        {/* Rating */}
        <span className="flex items-center gap-1 text-sm font-medium text-black">
          <Star className="h-4 w-4 fill-black text-black" />
          {item.rating || 0}
        </span>

        {/* Add / Quantity */}
        <AnimatePresence mode="wait" initial={false}>
          {qty === 0 ? (
            <motion.button
              key="add"
              onClick={handleAdd}
              disabled={loading || !item.available}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{ duration: 0.2 }}
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />

              {loading ? "Adding..." : "Add"}
            </motion.button>
          ) : (
            <motion.div
              key="stepper"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 rounded-full bg-black px-2 py-1.5 text-white"
            >
              {/* Minus */}
              <button
                aria-label="Decrease quantity"
                onClick={decreaseQty}
                disabled={loading}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-50"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              {/* Quantity */}
              <span className="relative w-4 h-5 overflow-hidden">
                <AnimatePresence
                  mode="popLayout"
                  initial={false}
                >
                  <motion.span
                    key={qty}
                    initial={{
                      y: 10,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    exit={{
                      y: -10,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
                  >
                    {qty}
                  </motion.span>
                </AnimatePresence>
              </span>

              {/* Plus */}
              <button
                aria-label="Increase quantity"
                onClick={increaseQty}
                disabled={loading}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}