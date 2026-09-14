import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src="/ernest-rentals-logo.png"
            alt="Ernest Rentals"
            className="h-11 w-11 rounded-xl bg-white object-contain"
          />

          <div className="hidden sm:block">
            <p className="text-[15px] font-black tracking-tight text-[#071226]">
              ERNEST RENTALS
            </p>

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Outdoor Advertising
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
          <Link
            className="transition hover:text-orange-600"
            href="/billboards"
          >
            Billboards
          </Link>

          <Link
            className="transition hover:text-orange-600"
            href="/digital-screens"
          >
            Digital Screens
          </Link>

          <Link
            className="transition hover:text-orange-600"
            href="/locations"
          >
            Locations
          </Link>

          <Link
            className="transition hover:text-orange-600"
            href="/how-it-works"
          >
            How It Works
          </Link>

          <Link
            className="transition hover:text-orange-600"
            href="/contact"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-slate-700">
              Menu
            </summary>

            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <Link
                className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                href="/billboards"
              >
                Billboards
              </Link>

              <Link
                className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                href="/digital-screens"
              >
                Digital Screens
              </Link>

              <Link
                className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                href="/locations"
              >
                Locations
              </Link>

              <Link
                className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                href="/how-it-works"
              >
                How It Works
              </Link>

              <Link
                className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                href="/contact"
              >
                Contact
              </Link>

              <Link
                className="mt-1 block rounded-xl bg-[#071226] px-3 py-2.5 text-sm font-extrabold text-white hover:bg-orange-600"
                href="/#availability"
              >
                Search Billboards
              </Link>
            </div>
          </details>

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
