import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <SiteHeader />

      <section className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#071226]">
            <img
              src="/ernest-rentals-logo.png"
              alt=""
              className="h-12 w-12 object-contain"
            />
          </div>

          <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
            404
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            This page could not be found.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-500">
            The page may have moved, or the link may no longer be available.
            You can return home or search the current Ernest Rentals billboard inventory.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
            >
              Back Home
            </Link>

            <Link
              href="/#availability"
              className="rounded-xl bg-[#071226] px-5 py-3 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search Billboards
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
