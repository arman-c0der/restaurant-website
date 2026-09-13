"use client";

import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";

const QUICK_INFO = [
  {
    icon: Phone,
    title: "Call us",
    value: "+1 (555) 052-7750",
  },
  {
    icon: Mail,
    title: "Email us",
    value: "hello@Tiffinly.kitchen",
  },
  {
    icon: MapPin,
    title: "Visit us",
    value: "4 kitchens · citywide",
  },
  {
    icon: Clock,
    title: "Working hours",
    value: "9:00 AM – 11:00 PM",
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: FaTwitter,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    // Demo submit
    // Later replace this with your API / Resend / MongoDB logic
    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  }

  return (
    <main className="w-full bg-white">
      {/* =========================
          Header
      ========================== */}
      <section className="w-full bg-[#F2F1EC]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex items-center gap-2 text-xs font-medium text-black/60">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span>Get in touch</span>
          </div>

          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-black sm:text-5xl">
            Let&apos;s talk food.
          </h1>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-black/60 sm:text-base">
            Questions, catering requests, feedback, or just want to say hi?
            Reach out and our team will get back to you within a day.
          </p>
        </div>
      </section>

      {/* =========================
          Quick Info Cards
      ========================== */}
      <section className="w-full bg-[#F2F1EC]">
        <div className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_INFO.map(({ icon: Icon, title, value }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/5">
                  <Icon
                    className="h-5 w-5 text-black"
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <p className="text-xs text-black/40">
                    {title}
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-black">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          Contact Form + Side Panel
      ========================== */}
      <section className="w-full bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-14 sm:px-8 lg:grid-cols-5 lg:gap-10 lg:px-10 lg:py-20">
          {/* =========================
              Contact Form
          ========================== */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
              Send us a message
            </h2>

            <p className="mt-2 text-sm text-black/50">
              Fill in the form below and we&apos;ll get back to you shortly.
            </p>

            {submitted ? (
              /* =========================
                 Success Message
              ========================== */
              <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[#F2F1EC] p-6">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-black" />

                <div>
                  <p className="text-sm font-semibold text-black">
                    Message sent!
                  </p>

                  <p className="mt-1 text-sm text-black/60">
                    Thanks for reaching out — we&apos;ll reply within 24
                    hours.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-semibold text-black underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-5"
              >
                {/* Name + Phone */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="text-xs font-medium text-black/60"
                    >
                      Full name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#F2F1EC] px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/30"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-xs font-medium text-black/60"
                    >
                      Phone number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#F2F1EC] px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/30"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-black/60"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-[#F2F1EC] px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/30"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="text-xs font-medium text-black/60"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#F2F1EC] px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black/30"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}

                  {!loading && (
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              </form>
            )}
          </div>

          {/* =========================
              Side Panel
          ========================== */}
          <div className="lg:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-3xl bg-black p-8">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Prefer to reach out directly?
                </h3>

                <p className="mt-2 text-sm text-white/50">
                  We&apos;re happy to help over phone or email too.
                </p>

                <ul className="mt-8 flex flex-col gap-5">
                  {/* Phone */}
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <Phone className="h-4 w-4 shrink-0 text-white/50" />

                    <span>+1 (555) 052-7750</span>
                  </li>

                  {/* Email */}
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <Mail className="h-4 w-4 shrink-0 text-white/50" />

                    <span>hello@Tiffinly.kitchen</span>
                  </li>

                  {/* Location */}
                  <li className="flex items-start gap-3 text-sm text-white/80">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />

                    <span>
                      4 kitchens · citywide, delivering daily
                    </span>
                  </li>

                  {/* Working Hours */}
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <Clock className="h-4 w-4 shrink-0 text-white/50" />

                    <span>
                      9:00 AM – 11:00 PM, every day
                    </span>
                  </li>
                </ul>
              </div>

              {/* Social Links */}
              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  Follow us
                </p>

                <div className="mt-4 flex items-center gap-3">
                  {SOCIALS.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Google Map
      ========================== */}
      <section className="w-full bg-white pb-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="relative h-[320px] w-full overflow-hidden rounded-3xl">
            <iframe
              title="Restaurant location map"
              src="https://www.google.com/maps?q=New%20York%2C%20NY&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}