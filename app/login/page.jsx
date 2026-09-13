"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
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
    const result = await signIn("credentials", {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        setError(
          "Invalid email or password. If you have not verified your email, please verify it first."
        );
      } else {
        setError(result.error);
      }

      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  } catch (error) {
    console.error("Login error:", error);

    setError("Something went wrong. Please try again.");
    setLoading(false);
  }
};

  const handleGoogleLogin = async () => {
    setError("");

    await signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-200 px-4 py-10">
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
          {/* Login Card */}
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
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-black/55">
                Sign in to your account
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
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
                transition={{
                  duration: 0.3,
                }}
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
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
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black/80"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-black/50 transition-colors hover:text-black"
                  >
                    Forgot password?
                  </Link>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-black/10 bg-gray-50 px-4 py-3.5 text-sm text-black outline-none transition-all duration-300 placeholder:text-black/30 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                />
              </motion.div>

              {/* Login Button */}
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
                {loading ? "Logging in..." : "Login"}
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

            {/* Google Login Button */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
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

            {/* Register Link */}
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
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-black underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                Register now
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}