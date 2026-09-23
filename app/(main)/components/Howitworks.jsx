"use client";

import {m } from "framer-motion";
import { Search, UtensilsCrossed, Package, Bike } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Pick your food",
    description:
      "Choose from our fresh burgers, crispy sides, pizzas and more.",
  },
  {
    number: "02",
    icon: UtensilsCrossed,
    title: "Add to your cart",
    description:
      "Build your order with your favorite meals, sides and drinks.",
  },
  {
    number: "03",
    icon: Package,
    title: "Packed with care",
    description:
      "Every order is freshly prepared and packed hot for delivery.",
  },
  {
    number: "04",
    icon: Bike,
    title: "Delivered to you",
    description:
      "Track your order and enjoy your favorite food at your doorstep.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const stepVariant = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const iconVariant = {
  hidden: { opacity: 0, scale: 0.4, rotate: -25 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 18, delay: 0.1 },
  },
};

const lineVariant = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

export default function HowItWorks() {
  return (
    <section className="w-full bg-[#F2F1EC]" id="how-it-works">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 text-xs font-medium text-[#8A6A2F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C97A2B]" />
            <span>From your order to your door</span>
          </div>
          <h2
            className="mt-3 text-3xl tracking-tight text-[#1F2420] sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            How it works
          </h2>
        </m.div>

        {/* Steps */}
        <m.div
          className="relative mt-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* connecting line (desktop only) */}
          <m.div
            variants={lineVariant}
            className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-[#1F2420]/15 lg:block"
            style={{
              marginLeft: "calc(12.5% + 24px)",
              marginRight: "calc(12.5% + 24px)",
            }}
          />

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map(({ number, icon: Icon, title, description }, idx) => (
              <m.div
                key={number}
                variants={stepVariant}
                className="group relative"
              >
                <div className="flex items-center gap-4">
                  <m.div
                    variants={iconVariant}
                    whileHover={{ scale: 1.08 }}
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F2420] shadow-[0_0_0_5px_#F2F1EC] transition-shadow duration-300 group-hover:shadow-[0_0_0_5px_#F2F1EC,0_0_0_7px_#C97A2B55]"
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </m.div>

                  <span
                    className="text-3xl text-[#1F2420]/10 sm:hidden lg:block"
                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                  >
                    {number}
                  </span>
                </div>

                <h3
                  className="mt-5 text-lg text-[#1F2420]"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                >
                  {title}
                </h3>
                <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-[#5A5650]">
                  {description}
                </p>

                {idx < STEPS.length - 1 && (
                  <div className="mt-6 h-px w-12 bg-[#1F2420]/15 sm:block lg:hidden" />
                )}
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}