"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, Star } from "lucide-react";

// সব stat একসাথে শুরু হয়ে একই সময়ে (DURATION সেকেন্ড পরে) শেষ হবে
const DURATION = 1.8;

const STATS = [
  { end: 7, decimals: 0, suffix: " Years", label: "Years of Services" },
  { end: 30, decimals: 0, suffix: " min", label: "Avg. Delivery" },
  { end: 1200, decimals: 0, suffix: "+", useComma: true, label: "Happy Customers" },
  { end: 4.9, decimals: 1, suffix: "", label: "Avg. Rating" },
];

function Counter({ end, decimals = 0, suffix = "", useComma = false, isInView }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, end, {
      duration: DURATION,
      ease: "easeOut",
      onUpdate: (latest) => setValue(latest),
    });

    return () => controls.stop();
  }, [isInView, end]);

  const formatted = useComma
    ? Math.round(value).toLocaleString()
    : value.toFixed(decimals);

  return (
    <>
      {formatted}
      {suffix}
    </>
  );
}

export default function Hero() {
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, margin: "-50px" });

  return (
    <section className="w-full bg-[#F5F2EA]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-16">
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs font-medium text-black/60"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span>Home-cooked · Made fresh daily</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[44px] font-bold leading-[1.05] tracking-tight text-black sm:text-6xl lg:text-[64px]"
          >
            Good food,
            <br />
            honestly made.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-black/60 sm:text-base"
          >
            Every dish is prepared fresh with quality ingredients and bold
            flavours — cooked with care, delivered fast, so every bite feels
            like home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/menu"
              className="group flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Browse full menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full border border-black/15 bg-transparent px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-black/5"
            >
              See how it works
            </Link>
          </motion.div>

          <dl ref={statsRef} className="mt-10 grid grid-cols-4 gap-4 sm:gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-xl font-bold text-black sm:text-2xl">
                  <Counter {...stat} isInView={isInView} />
                </dd>
                <dd className="mt-1 text-xs text-black/50 sm:text-sm">
                  {stat.label}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Right: hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto w-full max-w-[560px] lg:max-w-none"
        >
          <div className="relative h-[280px] w-full overflow-hidden rounded-3xl sm:h-[380px] lg:h-[460px]">
            <Image
              src="/items/hero-burger.png"
              alt="Freshly made dish"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>

          {/* Top-left floating info card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute left-0 top-2 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg sm:top-6"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5">
              <Package className="h-4 w-4 text-black" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight text-black">
                Caprese Toast #204
              </p>
              <p className="text-xs leading-tight text-black/50">
                Packed 7:40 AM
              </p>
            </div>
          </motion.div>

          {/* Bottom-right floating rating card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute bottom-2 right-0 flex items-center gap-3 rounded-2xl bg-black px-4 py-3 shadow-lg sm:bottom-6"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Star className="h-4 w-4 fill-white text-white" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight text-white">
                4.9 / 5.0
              </p>
              <p className="text-xs leading-tight text-white/60">
                3,100+ reviews
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}