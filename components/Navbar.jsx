"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Menu", href: "/menu" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  console.log('session', session)

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F2F1EC]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap");
      `}</style>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="32" height="32" rx="9" fill="#1F2420" />
            <rect
              x="9"
              y="8"
              width="16"
              height="4.5"
              rx="1.5"
              fill="#F2F1EC"
            />
            <rect
              x="9"
              y="14"
              width="16"
              height="5.5"
              rx="1.5"
              fill="#C97A2B"
            />
            <rect
              x="9"
              y="21.5"
              width="16"
              height="5"
              rx="1.5"
              fill="#F2F1EC"
              fillOpacity="0.85"
            />
            <path
              d="M15 5.5C15 4.5 15.9 3.5 17 3.5C18.1 3.5 19 4.5 19 5.5"
              stroke="#F2F1EC"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>

          <span
            className="text-xl tracking-tight text-black"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Tiffinly
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="nav-underline text-[15px] font-medium text-black/70 transition-colors duration-300 hover:text-black"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-black" />
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-2xl bg-white p-2 shadow-lg">
                  <p className="truncate px-3 py-2 text-sm font-semibold text-black">
                    {session.user.name}
                  </p>

                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 hover:text-black"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 hover:text-black"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black transition-colors duration-300 hover:bg-black/5"
            >
              Sign In
            </Link>
          )}

          {/* Cart Button */}
          <Link
            href="/cart"
            aria-label="View cart"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            <ShoppingBag className="h-4 w-4 text-black" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:scale-105 md:hidden"
        >
          {open ? (
            <X className="h-5 w-5 text-black" />
          ) : (
            <Menu className="h-5 w-5 text-black" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-black/10 bg-[#F2F1EC] px-5 pb-6 md:hidden">
          <ul className="flex flex-col gap-1 pt-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="mobile-nav-underline relative block w-fit rounded-lg px-2 py-3 text-base font-medium text-black/80 transition-colors duration-300 hover:text-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {status === "authenticated" && session.user.role === "admin" && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="mobile-nav-underline relative block w-fit rounded-lg px-2 py-3 text-base font-medium text-black/80 transition-colors duration-300 hover:text-black"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Actions */}
          <div className="mt-3 flex items-center gap-3">
            {status === "authenticated" ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}

            {/* Mobile Cart Button */}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
            >
              <ShoppingBag className="h-4 w-4" />
              View Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}