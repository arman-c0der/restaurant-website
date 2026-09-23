"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {m, AnimatePresence } from "framer-motion";
import {
  Search,
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  PackageX,
} from "lucide-react";
import {
  getProducts,
  getCategoriesList,
  toggleProductAvailability,
  deleteProduct,
} from "@/app/actions/getProducts";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPending, startTransition] = useTransition();

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    getProducts({ search: debouncedSearch, category, page })
      .then((res) => {
        if (res.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages || 1);
        }
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    getCategoriesList().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  const handleToggleAvailability = (product) => {
    startTransition(async () => {
      await toggleProductAvailability(product._id, !product.isAvailable);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isAvailable: !p.isAvailable } : p
        )
      );
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteProduct(deleteTarget._id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      }
      setDeleteTarget(null);
    });
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Products</h1>
          <p className="mt-1 text-sm text-black/50">
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name..."
            className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-black/30"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-black/30 sm:w-56"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02] text-left text-xs font-semibold uppercase tracking-wide text-black/40">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/5 last:border-0">
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-10 w-full animate-pulse rounded-lg bg-black/5" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center text-black/40">
                      <PackageX className="mb-2 h-8 w-8" />
                      <p className="text-sm">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <m.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-black/5 transition-colors last:border-0 hover:bg-black/[0.015]"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-black/5">
                           {product.image ? (
                      <Image
                       src={product.image}
                          alt={product.name}
                         fill
                          className="object-cover"
                         />
                          ) : null}
                          </div>
                          <span className="font-medium text-black">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-black/60">
                        {product.category?.name || "—"}
                      </td>
                      <td className="px-5 py-3 font-medium text-black">
                        ৳{product.price}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-black/60">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {product.rating?.toFixed(1) ?? "0.0"}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleToggleAvailability(product)}
                          disabled={isPending}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            product.isAvailable
                              ? "bg-green-50 text-green-600 hover:bg-green-100"
                              : "bg-red-50 text-red-500 hover:bg-red-100"
                          }`}
                        >
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/products/edit/${product._id}`}
                            className="rounded-lg p-2 text-black/50 transition-colors hover:bg-black/5 hover:text-black"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="rounded-lg p-2 text-black/50 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </m.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-black/10 px-5 py-3">
            <p className="text-xs text-black/40">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg p-2 text-black/60 transition-colors hover:bg-black/5 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg p-2 text-black/60 transition-colors hover:bg-black/5 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteTarget && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() => setDeleteTarget(null)}
          >
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6"
            >
              <h3 className="text-base font-semibold text-black">
                Delete product?
              </h3>
              <p className="mt-1.5 text-sm text-black/50">
                {deleteTarget.name} permanently মুছে যাবে। এই কাজটি undo করা যাবে না।
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-black/60 hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isPending}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}