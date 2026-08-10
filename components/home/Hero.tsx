import Link from "next/link";

const actionCards = [
  {
    title: "Donate",
    description: "Support our mission with a secure donation.",
    href: "/donate",
    label: "Donate Today",
    icon: "♥",
  },
  {
    title: "Volunteer",
    description: "Give your time and skills to help communities.",
    href: "/volunteer",
    label: "Become a Volunteer",
    icon: "✦",
  },
  {
    title: "Partner",
    description: "Create sustainable impact together.",
    href: "/partnerships",
    label: "Partner With Us",
    icon: "→",
  },
];

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-12">
          <div className="relative w-full">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-amber-500">
              About Across Uganda
            </p>

            <p className="mb-3 text-xl font-bold text-slate-900">
              Our Work
            </p>

            <h1
              id="hero-heading"
              className="text-3xl leading-[1.1] tracking-[-0.02em] text-slate-950 sm:text-5xl sm:leading-[1.05] lg:text-7xl lg:leading-[0.95] lg:tracking-[-0.04em]"
            >
              Together, we can give every child a safer and brighter future.
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
              The Guvnor Ace Foundation supports vulnerable children and
              families through food, education, child protection and practical,
              community-led support.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {actionCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition sm:p-5 lg:hover:-translate-y-0.5 lg:hover:border-amber-400/70 lg:hover:shadow-md"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white transition group-hover:bg-amber-500 group-hover:text-slate-950 sm:h-12 sm:w-12"
                  aria-hidden="true"
                >
                  {card.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-slate-950 sm:text-lg">
                    {card.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-6 text-slate-600">
                    {card.description}
                  </span>
                </span>

                <span
                  className="shrink-0 text-sm font-bold text-slate-950 transition lg:group-hover:translate-x-1 lg:group-hover:text-amber-600"
                  aria-hidden="true"
                >
                  {card.label} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}