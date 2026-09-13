"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const ACCENT = "#8A8478";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (!data.success) {
          toast.error(data.message || "Product not found");
          router.push("/menu");
          return;
        }
        setProduct(data.product);
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) loadProduct();
  }, [params.id, router]);

 async function addToCart() {
  try {
    console.log("🛒 ADD TO CART CLICKED");
    console.log("Product:", product);
    console.log("Product ID:", product?._id);
    console.log("Quantity:", quantity);

    setAdding(true);

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,
        quantity,
      }),
    });

    console.log("API STATUS:", res.status);

    const data = await res.json();

    console.log("API RESPONSE:", data);

    if (res.status === 401) {
      toast.error("Please login first");
      router.push("/login");
      return false;
    }

    if (!data.success) {
      console.log("❌ CART ERROR:", data.message);
      toast.error(data.message || "Failed to add to cart");
      return false;
    }

    console.log("✅ CART SUCCESS");

    toast.success("Added to cart");

    return true;
  } catch (error) {
    console.error("❌ Add to cart error:", error);
    toast.error("Something went wrong");
    return false;
  } finally {
    setAdding(false);
  }
}

async function orderNow() {
  const success = await addToCart();

  if (success) {
    router.push("/cart");
  }
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-medium text-gray-500">
        Loading...
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-8 md:py-12 text-slate-800">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Menu
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Image Section */}
            <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={images[imageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {product.category && (
                <span
                  className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Leaf size={13} />
                  {product.category}
                </span>
              )}

              <button
                onClick={() => setWishlisted((w) => !w)}
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Heart
                  size={18}
                  className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-700"}
                />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))
                    }
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 hover:bg-white"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))
                    }
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 hover:bg-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/10 backdrop-blur-md">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={`rounded-full transition-all duration-300 ${
                          i === imageIndex ? "w-4 h-2" : "w-2 h-2 opacity-60"
                        }`}
                        style={{
                          backgroundColor: i === imageIndex ? ACCENT : "#ffffff",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between h-full pt-1">
              <div>
                {product.badge && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3"
                    style={{
                      color: ACCENT,
                      borderColor: ACCENT,
                      backgroundColor: `${ACCENT}10`,
                    }}
                  >
                    <Star size={12} className="fill-current" />
                    {product.badge}
                  </span>
                )}

                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {product.name}
                </h1>

                <p className="mt-2.5 text-gray-500 text-sm md:text-base leading-relaxed">
                  {product.description}
                </p>

                {product.rating > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={16}
                          className={
                            n <= Math.round(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900 text-sm">
                      {product.rating}
                    </span>
                    {product.reviewsCount && (
                      <span className="text-gray-400 text-sm">
                        ({product.reviewsCount} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Price Section */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-3xl font-bold" style={{ color: ACCENT }}>
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ${Number(product.originalPrice).toFixed(2)}
                      </span>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${ACCENT}15`,
                          color: ACCENT,
                        }}
                      >
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Info Cards */}
                {(product.time || product.calories || product.freshness) && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 p-3 bg-gray-50/70 rounded-2xl border border-gray-100">
                    {product.time && (
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${ACCENT}15` }}
                        >
                          <Clock size={16} style={{ color: ACCENT }} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-gray-400 text-[11px] font-medium">Prep Time</p>
                          <p className="font-bold text-gray-800 text-xs sm:text-sm">
                            {product.time}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.calories && (
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${ACCENT}15` }}
                        >
                          <Flame size={16} style={{ color: ACCENT }} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-gray-400 text-[11px] font-medium">Calories</p>
                          <p className="font-bold text-gray-800 text-xs sm:text-sm">
                            {product.calories} kcal
                          </p>
                        </div>
                      </div>
                    )}
                    {product.freshness && (
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${ACCENT}15` }}
                        >
                          <Leaf size={16} style={{ color: ACCENT }} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-gray-400 text-[11px] font-medium">Ingredients</p>
                          <p className="font-bold text-gray-800 text-xs sm:text-sm">
                            {product.freshness}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity Control */}
                <div className="mt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Quantity
                  </p>
                  <div className="inline-flex items-center gap-4 bg-gray-50 p-1.5 rounded-full border border-gray-200">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ color: ACCENT }}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-base font-bold w-6 text-center text-gray-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ color: ACCENT }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={addToCart}
                    disabled={adding || !product.available}
                    className="flex-1 py-3.5 px-6 rounded-full flex items-center justify-center gap-2 font-bold text-white shadow-sm hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <ShoppingCart size={18} />
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    onClick={orderNow}
                    disabled={adding || !product.available}
                    className="flex-1 py-3.5 px-6 rounded-full border-2 flex items-center justify-center gap-2 font-bold transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: ACCENT, color: ACCENT }}
                  >
                    <Zap size={18} />
                    Order Now
                  </button>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mt-4 text-xs font-medium text-gray-500">
                  {product.available ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Check size={14} /> In stock
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Out of stock
                    </span>
                  )}
                  <span>•</span>
                  <span>Ready to serve</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}