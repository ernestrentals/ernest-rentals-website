import Link from "next/link";

const primaryNavigation = [
  {
    href: "/billboards",
    label: "Billboards",
  },
  {
    href: "/digital-screens",
    label: "Digital Screens",
  },
  {
    href: "/locations",
    label: "Locations",
  },
  {
    href: "/how-it-works",
    label: "How It Works",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">

        {/* BRAND / HOME */}
        <Link
          href="/"
          aria-label="Ernest Rentals homepage"
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src="/ernest-rentals-logo.png"
            alt="Ernest Rentals"
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl bg-white object-contain"
          />

          <div className="hidden sm:block">
            <p className="text-[15px] font-black tracking-tight text-[#071226]">
              ERNEST RENTALS
            </p>

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Billboard & Outdoor Advertising
            </p>
          </div>
        </Link>

        {/* PRIMARY DESKTOP NAVIGATION */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex"
        >
          {primaryNavigation.map(
            (
              item
            ) => (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className="transition hover:text-orange-600"
              >
                {
                  item.label
                }
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">

          {/* MOBILE NAVIGATION */}
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-slate-700 transition hover:border-slate-300">
              Menu
            </summary>

            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
            >
              {primaryNavigation.map(
                (
                  item
                ) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-orange-600"
                  >
                    {
                      item.label
                    }
                  </Link>
                )
              )}

              <div className="my-2 border-t border-slate-100" />

              <Link
                href="/#availability"
                className="block rounded-xl bg-[#071226] px-3 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-600"
              >
                Search Billboard Availability
              </Link>
            </nav>
          </details>

          {/* PRIMARY CTA */}
          <Link
            href="/#availability"
            className="hidden rounded-xl bg-[#071226] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-600 sm:inline-flex"
          >
            Search Billboards
          </Link>
        </div>
      </div>
    </header>
  );
}