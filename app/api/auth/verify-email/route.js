
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Registration successful.
      // User must verify email before logging in.
      setLoading(false);

      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);

      setError("Unable to connect to the server");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-md"
        >
          {/* Register Card */}
          <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-9">
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.5,
              }}
            >
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-black/55">
                Create your account to get started
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </motion.p>
            )}

            {/* Register Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="mt-7 flex flex-col gap-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {/* Name */}
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 12,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
              >
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-black/80"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-black/10 bg-gray-50 px-4 py-3.5 text-sm text-black outline-none transition-all duration-300 placeholder:text-black/30 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                />
              </motion.div>

              {/* Email */}
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 12,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
              >
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-black/80"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-black/10 bg-gray-50 px-4 py-3.5 text-sm text-black outline-none transition-all duration-300 placeholder:text-black/30 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                />
              </motion.div>

              {/* Password */}
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 12,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
              >
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-black/80"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-black/10 bg-gray-50 px-4 py-3.5 text-sm text-black outline-none transition-all duration-300 placeholder:text-black/30 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                />
              </motion.div>

              {/* Register Button */}
              <motion.button
                type="submit"
                disabled={loading}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 12,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                whileHover={{
                  scale: loading ? 1 : 1.015,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.98,
                }}
                className="mt-1 rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </motion.button>
            </motion.form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.55,
                duration: 0.5,
              }}
              className="my-6 flex items-center gap-3"
            >
              <span className="h-px flex-1 bg-black/10" />

              <span className="text-xs font-medium text-black/35">
                OR
              </span>

              <span className="h-px flex-1 bg-black/10" />
            </motion.div>

            {/* Google Button */}
            <motion.button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/",
                })
              }
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.6,
                duration: 0.5,
              }}
              whileHover={{
                scale: 1.015,
                backgroundColor: "#f8f8f8",
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="w-full rounded-xl border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all duration-300"
            >
              Continue with Google
            </motion.button>

            {/* Login Link */}
            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.7,
                duration: 0.5,
              }}
              className="mt-7 text-center text-sm text-black/55"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-black underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                Login
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


