import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import { Phone, Mail, MapPin } from "lucide-react";

const EXPLORE_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "Our Menu", href: "/menu", active: true },
  { label: "Meal Plans", href: "/meal-plans", active: false },
  { label: "Subscription", href: "/subscription", active: false },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about", active: false },
  { label: "Delivery Areas", href: "/delivery-areas", active: false },
  { label: "Offers", href: "/offers", active: false },
  { label: "FAQ", href: "/faq", active: false },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms", active: false },
  { label: "Privacy Policy", href: "/privacy", active: false },
  { label: "Refund Policy", href: "/refund-policy", active: false },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Twitter", href: "https://twitter.com", icon: FaTwitter },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-white/50">
        {title}
      </h3>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) =>
          link.active ? (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ) : (
            <li key={link.label} className="text-sm text-white/40">
              {link.label}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-black">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  width="32"
                  height="32"
                  rx="9"
                  fill="#F2F1EC"
                />
                <rect
                  x="9"
                  y="8"
                  width="16"
                  height="4.5"
                  rx="1.5"
                  fill="#1F2420"
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
                  fill="#2F4A3D"
                  fillOpacity="0.9"
                />
                <path
                  d="M15 5.5C15 4.5 15.9 3.5 17 3.5C18.1 3.5 19 4.5 19 5.5"
                  stroke="#1F2420"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              <span
                className="text-lg tracking-tight text-white"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
              >
                Tiffinly
              </span>
            </Link>

            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-white/50">
              Fresh food, bold flavors and delicious moments made for every
              kind of craving.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title="Explore" links={EXPLORE_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white/50">
              Contact
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="h-4 w-4 shrink-0 text-white/50" />
                <span>+1 (555) 052-7750</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="h-4 w-4 shrink-0 text-white/50" />
                <span>hello@tiffinly.kitchen</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <MapPin className="h-4 w-4 shrink-0 text-white/50" />
                <span>4 kitchens · citywide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © 2026 Food Brand. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Cooked with care, every single day.
          </p>
        </div>
      </div>
    </footer>
  );
}