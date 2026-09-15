import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductById } from "@/app/actions/getProducts";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;

  const result = await getProductById(id);

  if (!result.success || !result.product) {
    notFound();
  }

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

        <ProductDetailsClient product={result.product} />
      </div>
    </main>
  );
}