import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/app/actions/getProducts";
import MenuGrid from "./Menugrid";

export default async function TodaysMenu() {
  const result = await getProducts({ page: 1 });

  const products = result.success ? result.data.products.slice(0, 8) : [];

  // Map DB documents to the shape MenuCard expects.
  // Adjust the right-hand field names below to match your actual
  // Product schema (e.g. item.category?.name, item.prepTime, item.badge).
  const menuItems = products.map((item) => ({
    id: item._id,
    name: item.name,
    image: item.image || item.images?.[0] || "/items/placeholder.png",
    badge: item.badge || null,
    price: item.price,
    tag: item.category?.name || item.tag || "Veg",
    time: item.time || item.prepTime || "30 min",
    rating: item.rating ?? 4.7,
  }));

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-black/60">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              <span>Cooked fresh · Served hot</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Today&apos;s menu
            </h2>
          </div>

          <Link
            href="/menu"
            className="group hidden items-center gap-2 text-sm font-semibold text-black sm:flex"
          >
            Full menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Grid */}
        {menuItems.length > 0 ? (
          <MenuGrid items={menuItems} />
        ) : (
          <p className="mt-10 text-sm text-black/50">
            No menu items available right now.
          </p>
        )}

        {/* Mobile-only full menu link */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/menu"
            className="group flex items-center gap-2 text-sm font-semibold text-black"
          >
            Full menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}