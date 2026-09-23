"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {m } from "framer-motion";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, PenSquare, ArrowLeft } from "lucide-react";

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [imagePreview, setImagePreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    tag: "",
    time: "",
    isAvailable: true,
  });

  // Load product details
 useEffect(() => {
  async function fetchProduct() {
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load product");

      const p = data.product;

      setForm({
        name: p.name || "",
        price: p.price ?? "",
        category: p.category?.slug || p.category?._id || p.category || "",
        description: p.description || "",
        tag: p.tag || "",
        time: p.time || "",
        isAvailable: p.isAvailable ?? true,
      });

      setImagePreview(p.image || "");
    } catch (error) {
      toast.error(error.message || "Failed to load product");
    } finally {
      setLoadingProduct(false);
    }
  }

  if (id) fetchProduct();
}, [id]);

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load categories");
        setCategories(data.categories || []);
      } catch (error) {
        toast.error(error.message || "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  // Cleanup blob preview
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image size must be less than 4MB");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!form.category) {
      toast.error("Category selection is required");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("tag", form.tag);
      formData.append("time", form.time);
      formData.append("isAvailable", String(form.isAvailable));

      // শুধু নতুন image select করলেই পাঠানো হবে
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update product");
        return;
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);
      toast.error("Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex h-64 w-full max-w-4xl items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-black/40" />
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl"
    >
      {/* Page Header */}
      <div className="mb-7">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1.5 text-sm text-black/50 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white shadow-sm">
            <PenSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black">
              Edit Item
            </h1>
            <p className="mt-0.5 text-sm text-black/50">
              Update the details of this menu item
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
      >
        <div className="border-b border-black/10 bg-black/[0.015] px-6 py-5 sm:px-8">
          <h2 className="text-base font-semibold text-black">
            Item Information
          </h2>
          <p className="mt-1 text-sm text-black/45">
            Make changes and save to update this item.
          </p>
        </div>

        <m.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.07, delayChildren: 0.15 }}
          className="flex flex-col gap-6 p-6 sm:p-8"
        >
          {/* Image Upload */}
          <m.div variants={fieldVariants}>
            <label className="mb-2.5 block text-sm font-semibold text-black">
              Item Image
            </label>

            <label
              htmlFor="product-image"
              className="group relative flex h-64 w-full max-w-sm cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-black/10 bg-black/[0.02] transition-all duration-300 hover:border-black/25 hover:bg-black/[0.035]"
            >
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
                    <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-lg">
                      Change Image
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-black/40">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/[0.04]">
                    <ImagePlus className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-black/60">
                      Click to upload
                    </p>
                    <p className="mt-1 text-xs text-black/35">
                      PNG, JPG or WEBP • Max 4MB
                    </p>
                  </div>
                </div>
              )}
            </label>

            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </m.div>

          {/* Product Name */}
          <m.div variants={fieldVariants}>
            <label htmlFor="name" className="mb-2.5 block text-sm font-semibold text-black">
              Product Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Classic Beef Burger"
              className="w-full rounded-xl border border-black/10 bg-black/[0.015] px-4 py-3.5 text-sm text-black outline-none transition-all placeholder:text-black/30 hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
            />
          </m.div>

          {/* Price + Category */}
          <m.div variants={fieldVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="mb-2.5 block text-sm font-semibold text-black">
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full rounded-xl border border-black/10 bg-black/[0.015] px-4 py-3.5 text-sm text-black outline-none transition-all hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2.5 block text-sm font-semibold text-black">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loadingCategories}
                className="w-full rounded-xl border border-black/10 bg-black/[0.015] px-4 py-3.5 text-sm text-black outline-none transition-all hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5 disabled:opacity-50"
              >
                <option value="">
                  {loadingCategories ? "Loading categories..." : "Select Category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.slug || cat._id} value={cat.slug || cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </m.div>

          {/* Tag + Time */}
          <m.div variants={fieldVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="tag" className="mb-2.5 block text-sm font-semibold text-black">
                Tag (optional)
              </label>
              <input
                id="tag"
                type="text"
                name="tag"
                value={form.tag}
                onChange={handleChange}
                className="w-full rounded-xl border border-black/10 bg-black/[0.015] px-4 py-3.5 text-sm text-black outline-none transition-all hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
              />
            </div>

            <div>
              <label htmlFor="time" className="mb-2.5 block text-sm font-semibold text-black">
                Prep Time (optional)
              </label>
              <input
                id="time"
                type="text"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full rounded-xl border border-black/10 bg-black/[0.015] px-4 py-3.5 text-sm text-black outline-none transition-all hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
              />
            </div>
          </m.div>

          {/* Description */}
          <m.div variants={fieldVariants}>
            <label htmlFor="description" className="mb-2.5 block text-sm font-semibold text-black">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full resize-none rounded-xl border border-black/10 bg-black/[0.015] px-4 py-3.5 text-sm text-black outline-none transition-all hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
            />
          </m.div>

       
         {/* Availability toggle */}
<m.div variants={fieldVariants} className="flex items-center gap-3">
  <button
    type="button"
    onClick={() =>
      setForm((prev) => ({ ...prev, isAvailable: !prev.isAvailable }))
    }
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
      form.isAvailable ? "bg-green-500" : "bg-black/15"
    }`}
  >
    <span
      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 ${
        form.isAvailable ? "translate-x-6" : "translate-x-0.5"
      }`}
    />
  </button>

  <span className="whitespace-nowrap text-sm font-medium text-black">
    {form.isAvailable ? "Available" : "Unavailable"}
  </span>
</m.div>

          {/* Submit */}
          <m.button
            variants={fieldVariants}
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="mt-2 flex w-full self-end items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 text-sm font-semibold text-white transition-opacity disabled:opacity-60 sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </m.button>
        </m.form>
      </m.div>
    </m.div>
  );
}