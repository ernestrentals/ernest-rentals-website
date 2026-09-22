import Link from "next/link";

const whatsappUrl =
  "https://wa.me/17587133701?text=Hi%20Ernest%20Rentals%2C%20I%27m%20interested%20in%20billboard%20advertising%20in%20Saint%20Lucia.";

const mainPages = [
  {
    href: "/billboards",
    label: "Billboards",
    description:
      "Static billboard advertising across Saint Lucia.",
  },
  {
    href: "/digital-screens",
    label: "Digital Screens",
    description:
      "Digital billboard advertising and campaign packages.",
  },
  {
    href: "/locations",
    label: "Locations",
    description:
      "Explore billboard advertising locations.",
  },
  {
    href: "/how-it-works",
    label: "How It Works",
    description:
      "Learn how to search, select and start a campaign.",
  },
  {
    href: "/contact",
    label: "Contact",
    description:
      "Speak with the Ernest Rentals advertising team.",
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_.8fr]">

          {/* COMPANY */}
          <div>
            <Link
              href="/"
              aria-label="Ernest Rentals homepage"
              className="inline-flex items-center gap-3"
            >
              <img
                src="/ernest-rentals-logo.png"
                alt="Ernest Rentals"
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />

              <div>
                <p className="font-black text-[#071226]">
                  ERNEST RENTALS
                </p>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Billboard & Outdoor Advertising
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
              Static and digital billboard advertising across Saint Lucia.
              Explore locations, check live availability and start your
              advertising campaign online.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/#availability"
                className="inline-flex rounded-xl bg-[#071226] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-600"
              >
                Search Billboards
              </Link>

              <Link
                href="/contact"
                className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                Contact Ernest Rentals
              </Link>
            </div>
          </div>

          {/* MAIN SITE SECTIONS */}
          <nav
            aria-label="Ernest Rentals website sections"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Explore Ernest Rentals
            </p>

            <div className="mt-4 space-y-4">
              {mainPages.map(
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
                    className="group block"
                  >
                    <p className="text-sm font-extrabold text-slate-700 transition group-hover:text-orange-600">
                      {
                        item.label
                      }
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-slate-400">
                      {
                        item.description
                      }
                    </p>
                  </Link>
                )
              )}
            </div>
          </nav>

          {/* CONTACT */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Contact Ernest Rentals
            </p>

            <div className="mt-4 space-y-4 text-sm text-slate-500">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <a
                  href="tel:+17587133701"
                  className="mt-1 block font-semibold text-slate-600 transition hover:text-orange-600"
                >
                  +1 758-713-3701
                </a>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  WhatsApp
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Ernest Rentals on WhatsApp"
                  className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-extrabold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current"
                  >
                    <path d="M12 2a9.66 9.66 0 0 0-8.2 14.78L2.5 21.5l4.84-1.27A9.72 9.72 0 1 0 12 2Zm0 17.67a7.93 7.93 0 0 1-4.04-1.1l-.29-.17-2.87.75.77-2.8-.19-.29A7.95 7.95 0 1 1 12 19.67Zm4.36-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                  </svg>

                  Chat on WhatsApp
                </a>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <a
                  href="mailto:rentalsernest@gmail.com"
                  className="mt-1 block font-semibold text-slate-600 transition hover:text-orange-600"
                >
                  rentalsernest@gmail.com
                </a>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Service Area
                </p>

                <p className="mt-1 font-semibold text-slate-600">
                  Saint Lucia
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* SECONDARY SEO / USER NAVIGATION */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <nav
            aria-label="Popular Ernest Rentals pages"
            className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500"
          >
            <Link
              href="/billboards"
              className="transition hover:text-orange-600"
            >
              Billboard Advertising
            </Link>

            <Link
              href="/digital-screens"
              className="transition hover:text-orange-600"
            >
              Digital Billboard Advertising
            </Link>

            <Link
              href="/locations"
              className="transition hover:text-orange-600"
            >
              Billboard Locations
            </Link>

            <Link
              href="/how-it-works"
              className="transition hover:text-orange-600"
            >
              How Billboard Advertising Works
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-orange-600"
            >
              Contact Ernest Rentals
            </Link>
          </nav>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
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