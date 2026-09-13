import Image from "next/image";

export default function MenuHero() {
  return (
    <section className="w-full bg-[#F2F1EC]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="relative h-[260px] w-full overflow-hidden rounded-3xl sm:h-[340px] lg:h-[420px]">
          <Image
            src="/items/menu-banner.png"
            alt="Our Menu"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-10">
            <div className="flex items-center gap-2 text-xs font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span>Explore the menu</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Our Menu
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/70 sm:text-base">
              Fresh, home-cooked meals made daily — pick your craving.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}