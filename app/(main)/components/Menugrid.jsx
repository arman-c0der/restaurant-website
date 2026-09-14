"use client";

import { motion } from "framer-motion";
import { MenuCard } from "./MenuCard";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function MenuGrid({ items }) {
  return (
    <motion.div
      className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {items.map((menuItem) => (
        <motion.div
          key={menuItem.id}
          variants={item}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <MenuCard item={menuItem} key={menuItem.id} />
        </motion.div>
      ))}
    </motion.div>
  );
}