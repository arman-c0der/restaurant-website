"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    let redirectTimer;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
          return;
        }

        setStatus("success");
        setMessage("Your email has been verified successfully.");

        redirectTimer = setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        console.error(error);

        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [token, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
      >
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black" />

            <h1 className="text-2xl font-bold text-black">
              Verifying your email
            </h1>

            <p className="mt-3 text-sm text-black/55">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
              ✓
            </div>

            <h1 className="mt-6 text-2xl font-bold text-black">
              Email Verified
            </h1>

            <p className="mt-3 text-sm text-black/55">
              {message}
            </p>

            <p className="mt-5 text-xs text-black/40">
              Redirecting you to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
              !
            </div>

            <h1 className="mt-6 text-2xl font-bold text-black">
              Verification Failed
            </h1>

            <p className="mt-3 text-sm text-red-500">
              {message}
            </p>

            <Link
              href="/register"
              className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Back to Register
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}