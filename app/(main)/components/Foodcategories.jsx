"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sandwich,
  CupSoda,
  Soup,
  Drumstick,
  Pizza,
  Utensils,
} from "lucide-react";

const CATEGORIES = [
  { label: "Burgers", slug: "burgers", icon: Sandwich },
  { label: "Juicy & Fresh", slug: "juicy-fresh", icon: CupSoda },
  { label: "Rices", slug: "rices", icon: Soup },
  { label: "Chicken Fries", slug: "chicken-fries", icon: Drumstick },
  { label: "Pizza", slug: "pizza", icon: Pizza },
  { label: "French-fries", slug: "french-fries", icon: Utensils },
];

// Parent container: children কে stagger করে একে একে animate করাবে
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// প্রতিটা card এই variant অনুযায়ী fade + slide-up হয়ে আসবে
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function FoodCategories() {
  return (
    <section className="w-full bg-[#F2F1EC]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-black/60">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              <span>What are you craving?</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Browse by food type
            </h2>
          </div>

          <Link
            href="/menu"
            className="group hidden items-center gap-2 text-sm font-semibold text-black sm:flex"
          >
            See full menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Category grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {CATEGORIES.map(({ label, slug, icon: Icon }) => (
            <motion.div key={label} variants={cardVariants}>
              <Link
                href={`/menu?category=${slug}`}
                className="flex flex-col items-center rounded-2xl bg-white px-4 py-8 text-center shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/5">
                  <Icon className="h-6 w-6 text-black" strokeWidth={1.8} />
                </span>
                <p className="mt-4 text-sm font-semibold text-black">
                  {label}
                </p>
                <p className="mt-1 text-xs text-black/40">Available</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile-only "see full menu" link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/menu"
            className="group flex items-center gap-2 text-sm font-semibold text-black"
          >
            See full menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}