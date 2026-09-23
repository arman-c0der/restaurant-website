import Image from "next/image";
import { BadgeCheck, Clock, Leaf } from "lucide-react";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Fresh ingredients",
    description: "Carefully selected ingredients make every meal taste better.",
  },
  {
    icon: Clock,
    title: "Made to order",
    description: "Every dish is prepared fresh when you place your order.",
  },
  {
    icon: Leaf,
    title: "Real, simple flavors",
    description: "No unnecessary extras, just delicious food made right.",
  },
];

export default function WhyDabba() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-10 px-5 pb-0 pt-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pt-20">
        {/* Left: image */}
        <div className="relative h-[320px] w-full sm:h-[420px] lg:h-[500px]">
          <Image
            src="/people/stuff.png"
            alt="Our chef"
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-contain object-bottom"
            priority
          />
        </div>

        {/* Right: copy */}
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-black/60">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span>Why Dabba</span>
          </div>

          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl">
            Cooked with care, served with flavor.
          </h2>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black/60">
            Every dish is made with fresh ingredients, bold flavors and
            recipes we truly love. That&apos;s the difference you can taste
            in every bite.
          </p>

          <ul className="mt-10 flex flex-col gap-7">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black">
                  <Icon className="h-4 w-4 text-white" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-black">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-black/50">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}