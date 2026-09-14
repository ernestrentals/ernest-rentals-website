import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      className="border-t border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <img
                src="/ernest-rentals-logo.png"
                alt="Ernest Rentals"
                className="h-11 w-11 object-contain"
              />

              <div>
                <p className="font-black text-[#071226]">
                  ERNEST RENTALS
                </p>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Outdoor Advertising
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
              Static and digital billboard advertising across Saint Lucia.
              Search locations, check availability and start your campaign online.
            </p>

            <Link
              href="/#availability"
              className="mt-5 inline-flex rounded-xl bg-[#071226] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-600"
            >
              Search Billboards
            </Link>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Explore
            </p>

            <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
              <Link
                href="/billboards"
                className="block transition hover:text-orange-600"
              >
                Billboards
              </Link>

              <Link
                href="/digital-screens"
                className="block transition hover:text-orange-600"
              >
                Digital Screens
              </Link>

              <Link
                href="/locations"
                className="block transition hover:text-orange-600"
              >
                Locations
              </Link>

              <Link
                href="/how-it-works"
                className="block transition hover:text-orange-600"
              >
                How It Works
              </Link>

              <Link
                href="/contact"
                className="block transition hover:text-orange-600"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Contact
            </p>

            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <a
                href="tel:+17587133701"
                className="block font-semibold transition hover:text-orange-600"
              >
                758-713-3701
              </a>

              <a
                href="mailto:rentalsernest@gmail.com"
                className="block font-semibold transition hover:text-orange-600"
              >
                rentalsernest@gmail.com
              </a>

              <p>
                Praslin, Micoud, Saint Lucia
              </p>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400">
            © 2026 Ernest Rentals. All rights reserved.
          </p>

          <p className="text-xs font-semibold text-slate-400">
            Own the Visibility. Own the Location.
          </p>
        </div>
      </div>
    </footer>
  );
}
