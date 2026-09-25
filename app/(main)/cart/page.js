"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      setItems(data.items || []);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      loadCart();
    } catch {
      toast.error("Failed to update cart");
    }
  }

  async function removeItem(productId) {
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      toast.success("Item removed");
      loadCart();
    } catch {
      toast.error("Failed to remove item");
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = subtotal >= 50 ? 0 : 3;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = subtotal + deliveryFee + tax;
  const amountToFreeDelivery = Math.max(0, 50 - subtotal);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#E7E2D8] border-t-[#C97A2B] animate-spin" />
          <p className="text-sm text-[#8A8377]">Loading your cart…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF9F5] py-14">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap");
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1
            className="text-[2.75rem] leading-none text-[#1F2420]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Your cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F1ECE2] flex items-center justify-center mb-5">
              <ShoppingBag size={22} className="text-[#C97A2B]" />
            </div>
            <h2
              className="text-2xl text-[#1F2420] mb-2"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              Your cart is empty
            </h2>
            <p
              className="text-[#8A8377] mb-7 max-w-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Nothing here yet. Browse the menu to find something to eat.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1F2420] text-white text-sm font-medium hover:bg-[#2F4A3D] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Browse menu
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 border border-amber-700"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-[#E7E2D8] bg-white overflow-hidden">
                <div className="flex items-center justify-between px-7 py-5 border-b border-[#E7E2D8] bg-[#F7F4EC]">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={17} className="text-[#C97A2B]" />
                    <h2
                      className="text-[#1F2420]"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 500,
                        fontSize: "1.15rem",
                      }}
                    >
                      Items in your cart
                    </h2>
                  </div>
                  <span className="text-xs text-[#8A8377]">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="px-7">
                  {items.map((item, idx) => (
                    <div
                      key={item.productId}
                      className={`flex gap-5 items-center py-6 ${
                        idx !== items.length - 1
                          ? "border-b border-[#EFEBE1]"
                          : ""
                      }`}
                    >
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F1ECE2] ring-1 ring-[#E7E2D8]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                     
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#1F2420] text-base truncate">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-[#8A8377]">
                          ${Number(item.price).toFixed(2)} each
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex items-center gap-3 rounded-full border border-[#E7E2D8] px-1 py-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              aria-label="Decrease quantity"
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[#1F2420] hover:bg-[#F1ECE2] transition-colors"
                            >
                              <Minus size={13} />
                            </button>

                            <span className="w-4 text-[#1F2420] text-center text-sm font-medium tabular-nums">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              aria-label="Increase quantity"
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[#1F2420] hover:bg-[#F1ECE2] transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            aria-label="Remove item"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A8377] hover:text-[#B3452C] hover:bg-[#F1ECE2] transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-medium text-[#1F2420] tabular-nums text-[1.05rem]">
                          ${item.subtotal.toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-[#8A8377] mt-1">
                            {item.quantity} × $
                            {Number(item.price).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-7 py-4 border-t border-[#E7E2D8] bg-[#F7F4EC]">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-1.5 text-sm text-[#2F4A3D] font-medium hover:underline"
                  >
                    <Plus size={14} />
                    Add more items
                  </Link>
                </div>
              </div>
            </div>

            <div className="h-fit lg:sticky lg:top-10">
              <div className="rounded-3xl border border-[#E7E2D8] p-7 bg-white">
                <h2
                  className="text-xl text-[#1F2420] mb-6"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
                >
                  Order summary
                </h2>

                {amountToFreeDelivery > 0 && (
                  <div className="mb-6 text-sm rounded-xl bg-[#F1ECE2] text-[#6B5A3A] px-4 py-3">
                    Add ${amountToFreeDelivery.toFixed(2)} more for free
                    delivery
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#4A463F]">
                    <span>Subtotal</span>
                    <span className="tabular-nums">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#4A463F]">
                    <span>Delivery</span>
                    <span className="tabular-nums">
                      {deliveryFee === 0 ? (
                        <span className="text-[#2F4A3D] font-medium">
                          Free
                        </span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#4A463F]">
                    <span>Tax</span>
                    <span className="tabular-nums">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-[#E7E2D8] mt-5 pt-5 flex justify-between items-baseline">
                  <span className="text-[#1F2420] font-medium">Total</span>
                  <span
                    className="text-2xl text-[#1F2420] tabular-nums"
                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 mt-7 py-4 rounded-full bg-[#1F2420] text-white font-medium text-sm hover:bg-[#2F4A3D] transition-colors"
                >
                  Proceed to checkout
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}