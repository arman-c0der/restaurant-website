"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const PROMO_CODE = "WELCOME20";

export default function OfferBanner() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available, ignore silently
    }
  }

  return (
    <section className="w-full bg-[#F2F1EC]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
        {/* Left: copy */}
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#8A6A2F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C97A2B]" />
            <span>Limited time offer</span>
          </div>

          <h2
            className="mt-4 text-4xl leading-[1.1] tracking-tight text-[#1F2420] sm:text-[2.75rem]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Get 20% off your first order.
          </h2>

          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#5A5650]">
            Craving something delicious? Enjoy 20% off your first order and
            discover your new favorite meals, made fresh and delivered
            straight to your door.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-3 rounded-full border border-dashed border-[#1F2420]/30 bg-white pl-5 pr-2 py-2 transition-colors hover:border-[#1F2420]/50"
            >
              <span
                className="text-sm font-semibold tracking-wide text-[#1F2420]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {PROMO_CODE}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F2420] text-white">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </span>
            </button>

            <span className="text-sm text-[#8A8377]">
              {copied ? "Copied — use it at checkout" : "Copy code at checkout"}
            </span>
          </div>
        </div>

        {/* Right: discount stamp */}
        <div className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px]">
          <svg
            viewBox="0 0 400 400"
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="none"
              stroke="#C97A2B"
              strokeWidth="2"
              strokeDasharray="3 10"
              strokeLinecap="round"
            />
            <circle cx="200" cy="200" r="160" fill="#1F2420" />
            <circle
              cx="200"
              cy="200"
              r="146"
              fill="none"
              stroke="#F2F1EC"
              strokeOpacity="0.15"
              strokeWidth="1.5"
            />

            <text
              x="200"
              y="196"
              textAnchor="middle"
              fill="#F2F1EC"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
              fontSize="92"
            >
              20%
            </text>
            <text
              x="200"
              y="248"
              textAnchor="middle"
              fill="#C97A2B"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
              fontSize="30"
              letterSpacing="4"
            >
              OFF
            </text>
            <text
              x="200"
              y="278"
              textAnchor="middle"
              fill="#F2F1EC"
              fillOpacity="0.55"
              fontSize="12"
              letterSpacing="2"
            >
              first order only
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}