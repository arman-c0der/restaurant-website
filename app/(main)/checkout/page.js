"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Truck, Wallet, CreditCard, ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!data.items?.length) {
          router.push("/cart");
          return;
        }

        setItems(data.items);
      } catch {
        toast.error("Failed to load checkout");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = subtotal >= 50 ? 0 : 3;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = subtotal + deliveryFee + tax;

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function placeOrder(e) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setPlacing(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      router.push(`/order-success?order=${data.order.orderNumber}`);
    } catch {
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#E7E2D8] border-t-[#C97A2B] animate-spin" />
          <p className="text-sm text-[#8A8377]">Loading checkout…</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-[#E7E2D8] bg-[#FBF9F5] px-4 py-3 text-sm text-[#1F2420] outline-none transition-colors placeholder:text-[#8A8377] focus:border-[#C97A2B] focus:bg-white";

  return (
    <main
      className="min-h-screen bg-[#FBF9F5] py-14"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap");
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <h1
          className="text-[2.75rem] leading-none text-[#1F2420] mb-10"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
        >
          Checkout
        </h1>

        <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 rounded-3xl border border-[#E7E2D8] bg-white overflow-hidden">
            <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#E7E2D8] bg-[#F7F4EC]">
              <Truck size={17} className="text-[#C97A2B]" />
              <h2
                className="text-[#1F2420]"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 500,
                  fontSize: "1.15rem",
                }}
              >
                Delivery information
              </h2>
            </div>

            <div className="p-7 space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#1F2420]">
                  Full name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-[#1F2420]">
                  Phone number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-[#1F2420]">
                  Delivery address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your full delivery address"
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block mb-3 text-sm font-medium text-[#1F2420]">
                  Payment method
                </label>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      form.paymentMethod === "cod"
                        ? "border-[#C97A2B] bg-[#FBF3E7]"
                        : "border-[#E7E2D8] bg-[#FBF9F5]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#C97A2B]"
                    />
                    <Wallet size={17} className="text-[#1F2420]" />
                    <span className="text-sm font-medium text-[#1F2420]">
                      Cash on delivery
                    </span>
                  </label>

                  <label className="flex items-center gap-3 rounded-xl border border-[#E7E2D8] bg-[#FBF9F5] p-4 cursor-not-allowed opacity-60">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={form.paymentMethod === "stripe"}
                      onChange={handleChange}
                      disabled
                      className="h-4 w-4 accent-[#C97A2B]"
                    />
                    <CreditCard size={17} className="text-[#1F2420]" />
                    <span className="text-sm font-medium text-[#1F2420]">
                      Card payment (Stripe)
                    </span>
                    <span className="ml-auto text-xs text-[#8A8377]">
                      Coming soon
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="h-fit lg:sticky lg:top-10">
            <div className="rounded-3xl border border-[#E7E2D8] bg-white p-7">
              <h2
                className="text-xl text-[#1F2420] mb-6"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
              >
                Order summary
              </h2>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span className="text-[#4A463F]">
                      {item.name}{" "}
                      <span className="text-[#8A8377]">× {item.quantity}</span>
                    </span>
                    <span className="text-[#1F2420] font-medium tabular-nums shrink-0">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E7E2D8] mt-5 pt-5 space-y-3 text-sm">
                <div className="flex justify-between text-[#4A463F]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#4A463F]">
                  <span>Delivery</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-[#2F4A3D] font-medium">Free</span>
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

              <button
                type="submit"
                disabled={placing}
                className="w-full flex items-center justify-center gap-2 mt-7 py-4 rounded-full bg-[#1F2420] text-white font-medium text-sm transition-colors hover:bg-[#2F4A3D] disabled:opacity-50 disabled:hover:bg-[#1F2420]"
              >
                {placing ? (
                  "Placing order…"
                ) : (
                  <>
                    Place order
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}