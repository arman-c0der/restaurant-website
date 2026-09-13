"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  ShoppingCart,
  LogOut,
} from "lucide-react";

const LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Add Product", href: "/admin/products/add", icon: PlusCircle },
 
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-screen w-64 shrink-0 flex-col border-r border-black/10 bg-[#F8F7F3] px-4 py-6"
    >
      <Link href="/"  className="px-2 text-lg font-bold tracking-tight text-black">
        Tiffinly
      </Link>
       <div className="px-2 text-lg font-bold tracking-tight text-gray-400">Admin</div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {LINKS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link key={href} href={href} className="relative block">
              {active && (
                <motion.span
                  layoutId="admin-active-link"
                  className="absolute inset-0 rounded-xl bg-black"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-black/60 hover:text-black"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black/60 transition-colors hover:text-black"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </motion.aside>
  );
}