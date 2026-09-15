import Link from "next/link";

const whatsappUrl =
  "https://wa.me/17587133701?text=Hi%20Ernest%20Rentals%2C%20I%27m%20interested%20in%20billboard%20advertising%20in%20Saint%20Lucia.";

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
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Ernest Rentals on WhatsApp"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-extrabold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-current"
                >
                  <path d="M12 2a9.66 9.66 0 0 0-8.2 14.78L2.5 21.5l4.84-1.27A9.72 9.72 0 1 0 12 2Zm0 17.67a7.93 7.93 0 0 1-4.04-1.1l-.29-.17-2.87.75.77-2.8-.19-.29A7.95 7.95 0 1 1 12 19.67Zm4.36-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/>
                </svg>

                WhatsApp
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
