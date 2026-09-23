// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/", // অ্যাডমিন ড্যাশবোর্ড সার্চ ইঞ্জিন থেকে হাইড থাকবে
    },
  };
}