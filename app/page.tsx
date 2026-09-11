import AvailabilitySearch from "@/components/AvailabilitySearch";

const locations = [
  {
    city: "Castries",
    name: "Massy Building",
    type: "Digital",
    size: "20 × 10 ft",
    status: "Available",
    accent: "from-orange-500 to-red-500",
  },
  {
    city: "Dennery",
    name: "Richfond",
    type: "Static",
    size: "10 × 20 ft",
    status: "Available",
    accent: "from-sky-500 to-blue-600",
  },
  {
    city: "Micoud",
    name: "Praslin",
    type: "Static",
    size: "8 × 20 ft",
    status: "Available",
    accent: "from-orange-400 to-orange-600",
  },
  {
    city: "Micoud",
    name: "Mamiku",
    type: "Static",
    size: "8 × 20 ft",
    status: "Limited",
    accent: "from-sky-400 to-cyan-500",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/ernest-rentals-logo.png"
              alt="Ernest Rentals"
              className="h-11 w-11 rounded-xl bg-white object-contain"
            />

            <div>
              <p className="text-lg font-extrabold tracking-tight">
                ERNEST RENTALS
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Outdoor Advertising
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            <a className="hover:text-orange-600" href="#billboards">Billboards</a>
            <a className="hover:text-orange-600" href="#digital">Digital Screens</a>
            <a className="hover:text-orange-600" href="#locations">Locations</a>
            <a className="hover:text-orange-600" href="#how-it-works">How It Works</a>
            <a className="hover:text-orange-600" href="#contact">Contact</a>
          </nav>

          <a
            href="#availability"
            className="rounded-xl bg-[#071226] px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Check Availability
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#071226] text-white">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
              Saint Lucia Outdoor Advertising
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              Put your brand
              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-sky-400 bg-clip-text text-transparent">
                in plain sight.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Discover high-visibility static and digital billboard opportunities
              across Saint Lucia. Check availability, compare locations and start
              your campaign request online.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#availability"
                className="rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white transition hover:bg-orange-600"
              >
                Find Available Billboards
              </a>

              <a
                href="#how-it-works"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                How It Works
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-2xl font-black">Static</p>
                <p className="mt-1 text-sm text-slate-400">Premium roadside sites</p>
              </div>
              <div>
                <p className="text-2xl font-black">Digital</p>
                <p className="mt-1 text-sm text-slate-400">10s & 15s advertising</p>
              </div>
              <div>
                <p className="text-2xl font-black">Islandwide</p>
                <p className="mt-1 text-sm text-slate-400">High-traffic locations</p>
              </div>
            </div>
          </div>

          {/* BILLBOARD VISUAL */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-orange-400 via-orange-500 to-sky-500 p-[2px]">
                <div className="rounded-[1.4rem] bg-[#020817] p-8">
                  <div className="flex items-center gap-4">
                    <img
                      src="/ernest-rentals-logo.png"
                      alt=""
                      className="h-16 w-16 object-contain"
                    />
                    <div>
                      <p className="text-2xl font-black">ERNEST RENTALS</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Own the visibility. Own the location.
                      </p>
                    </div>
                  </div>

                  <div className="mt-12">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-400">
                      Your brand belongs here
                    </p>
                    <p className="mt-3 text-4xl font-black leading-tight">
                      Big brands go further.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mx-auto h-20 w-6 bg-slate-700" />
              <div className="mx-auto h-4 w-48 rounded-full bg-slate-700" />
            </div>
          </div>
        </div>
      </section>

      {/* AVAILABILITY SEARCH */}
      <AvailabilitySearch />

      {/* BENEFITS */}
      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Premium Locations", "High-visibility advertising sites"],
            ["Static + Digital", "Options for every campaign"],
            ["Flexible Campaigns", "Weekly to annual advertising"],
            ["Local Support", "Managed right here in Saint Lucia"],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-sky-500" />
              <p className="font-bold">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED LOCATIONS */}
      <section id="locations" className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
                Explore
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-tight">Featured Locations</h2>
              <p className="mt-2 text-slate-500">High-traffic advertising opportunities across Saint Lucia.</p>
            </div>

            <a href="#" className="font-bold text-sky-600">View all locations →</a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {locations.map((item) => (
              <a
                href="#"
                key={`${item.city}-${item.name}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`h-44 bg-gradient-to-br ${item.accent} p-5`}>
                  <div className="flex h-full items-end rounded-xl border border-white/20 bg-[#071226]/85 p-5 text-white">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Your Brand Here</p>
                      <p className="mt-2 text-2xl font-black">ERNEST RENTALS</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold">{item.city}</p>
                      <p className="text-sm text-slate-500">{item.name}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <span className="font-semibold text-slate-600">{item.type}</span>
                    <span className="text-slate-400">{item.size}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* STATIC / DIGITAL */}
      <section id="billboards" className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-[#071226] p-8 text-white lg:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">Static Billboards</p>
            <h3 className="mt-3 text-4xl font-black">Make a lasting impression.</h3>
            <p className="mt-4 max-w-xl leading-7 text-slate-300">
              High-impact static billboard locations for businesses that want consistent visibility every day.
            </p>
            <a href="#" className="mt-8 inline-block rounded-xl border border-orange-400 px-5 py-3 font-bold text-orange-300">
              View Static Billboards →
            </a>
          </div>

          <div id="digital" className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-8 text-[#071226] lg:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em]">Digital Advertising</p>
            <h3 className="mt-3 text-4xl font-black">Dynamic ads. Real visibility.</h3>
            <p className="mt-4 max-w-xl leading-7 text-[#071226]/75">
              Promote your business using vibrant 10-second and premium 15-second digital advertising packages.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
              <span className="rounded-full bg-white/70 px-4 py-2">10-Second Standard</span>
              <span className="rounded-full bg-white/70 px-4 py-2">15-Second Premium</span>
            </div>

            <a href="#" className="mt-8 inline-block rounded-xl bg-[#071226] px-5 py-3 font-bold text-white">
              Check Digital Availability →
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Simple Process
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">From search to campaign launch.</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["01", "Find a Billboard", "Browse locations and choose static or digital advertising."],
              ["02", "Check Availability", "Select your dates and see advertising options."],
              ["03", "Start Your Campaign", "Send us your company and campaign information."],
              ["04", "We Confirm & Launch", "Our team reviews, confirms and prepares your campaign."],
            ].map(([number, title, body]) => (
              <div key={number} className="rounded-2xl border border-slate-200 p-6">
                <p className="text-3xl font-black text-orange-500">{number}</p>
                <p className="mt-5 text-xl font-bold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#071226] px-8 py-12 text-white lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">Ready to be seen?</p>
              <h2 className="mt-2 text-4xl font-black">Start your next billboard campaign.</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Tell us where and when you want to advertise. We’ll help you find the best available option.
              </p>
            </div>

            <a href="#availability" className="rounded-xl bg-orange-500 px-6 py-4 font-bold text-white">
              Check Availability
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-slate-200 bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/ernest-rentals-logo.png" alt="" className="h-10 w-10 object-contain" />
            <div>
              <p className="font-extrabold">ERNEST RENTALS</p>
              <p className="text-xs text-slate-500">Outdoor Advertising • Saint Lucia</p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 Ernest Rentals. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
