const TESTIMONIALS = [
  {
    quote:
      "Honestly one of the best burgers I've had in a long time. Everything tasted fresh and delicious.",
    name: "Amelia Ross",
    plan: "Weekly Plan",
    initials: "AR",
  },
  {
    quote:
      "The monthly plan pays for itself. On-time every single day for two months straight now.",
    name: "Daniel Osei",
    plan: "Monthly Plan",
    initials: "DO",
  },
  {
    quote:
      "Ordered the fish curry on a whim — genuinely the best home-style curry I've had delivered.",
    name: "Priya Nandan",
    plan: "Daily Order",
    initials: "PN",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-medium text-black/60">
          <span className="h-1.5 w-1.5 rounded-full bg-black" />
          <span>Guest notes</span>
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
          What people are saying
        </h2>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {TESTIMONIALS.map(({ quote, name, plan, initials }) => (
            <div
              key={name}
              className="flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-6"
            >
              <p className="text-sm leading-relaxed text-black/70">
                &ldquo;{quote}&rdquo;
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-semibold text-black">
                  {initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-black">{name}</p>
                  <p className="text-xs text-black/40">{plan}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}