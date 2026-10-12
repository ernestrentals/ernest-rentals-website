import type {
  Metadata,
} from "next";

import Link from "next/link";

import PrintArtworkGuideButton from "@/components/PrintArtworkGuideButton";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

export const metadata:
  Metadata = {
  title:
    "Billboard Artwork Guidelines",
  description:
    "Learn how to prepare effective static and digital billboard artwork for Ernest Rentals advertising campaigns in Saint Lucia.",
  alternates: {
    canonical:
      "/artwork-guidelines",
  },
  openGraph: {
    title:
      "Billboard Artwork Guidelines | Ernest Rentals Saint Lucia",
    description:
      "Prepare clear, effective static and digital billboard artwork for your Ernest Rentals campaign.",
    url:
      "/artwork-guidelines",
    siteName:
      "Ernest Rentals",
    locale:
      "en_LC",
    type:
      "website",
    images: [
      {
        url:
          "/ernest-rentals-logo.png",
        width:
          256,
        height:
          256,
        alt:
          "Ernest Rentals billboard artwork guidelines",
      },
    ],
  },
  twitter: {
    card:
      "summary_large_image",
    title:
      "Billboard Artwork Guidelines | Ernest Rentals",
    description:
      "Prepare clear, effective static and digital billboard artwork for advertising in Saint Lucia.",
    images: [
      "/ernest-rentals-logo.png",
    ],
  },
};

const structuredData = {
  "@context":
    "https://schema.org",
  "@graph": [
    {
      "@type":
        "WebPage",
      "@id":
        `${siteUrl}/artwork-guidelines#webpage`,
      url:
        `${siteUrl}/artwork-guidelines`,
      name:
        "Billboard Artwork Guidelines",
      description:
        "Client creative guidance for static and digital Ernest Rentals billboard campaigns in Saint Lucia.",
      isPartOf: {
        "@id":
          `${siteUrl}/#website`,
      },
      breadcrumb: {
        "@id":
          `${siteUrl}/artwork-guidelines#breadcrumb`,
      },
      inLanguage:
        "en-LC",
    },
    {
      "@type":
        "BreadcrumbList",
      "@id":
        `${siteUrl}/artwork-guidelines#breadcrumb`,
      itemListElement: [
        {
          "@type":
            "ListItem",
          position:
            1,
          name:
            "Home",
          item:
            siteUrl,
        },
        {
          "@type":
            "ListItem",
          position:
            2,
          name:
            "Artwork Guidelines",
          item:
            `${siteUrl}/artwork-guidelines`,
        },
      ],
    },
  ],
};

const designPrinciples = [
  "Keep the message simple and focus on one main idea.",
  "Use seven words or fewer where practical.",
  "Make the brand name or logo prominent.",
  "Use large, readable typography and strong contrast.",
  "Choose one clear image rather than several competing visuals.",
  "Keep phone numbers and website addresses short and easy to read.",
];

const digitalGuidance = [
  "Avoid small text and crowded layouts.",
  "Keep important information visible long enough to read from the road.",
  "Use simple motion and clear transitions.",
  "Do not rely on audio to communicate the message.",
  "Avoid rapid flashing or distracting effects.",
  "Design for quick roadside viewing rather than close-up screen viewing.",
];

const staticGuidance = [
  "Match the final artwork to the dimensions of the selected billboard.",
  "Supply high-resolution source artwork suitable for large-format production.",
  "Use a bold headline, one main visual and minimal supporting text.",
  "Keep the logo large and make the call to action immediately clear.",
  "Confirm final production specifications with Ernest Rentals before export.",
];

const approvalSteps = [
  {
    title:
      "Artwork Submitted",
    copy:
      "The client supplies completed artwork or coordinates creative work with Ernest Rentals.",
  },
  {
    title:
      "Ernest Rentals Review",
    copy:
      "The team checks the creative against the selected billboard, campaign and current technical requirements.",
  },
  {
    title:
      "Changes Requested",
    copy:
      "If changes are needed, the team provides clear feedback and a revised version can be submitted.",
  },
  {
    title:
      "Client Approval",
    copy:
      "The client confirms that the final message, details and creative are correct.",
  },
  {
    title:
      "Final Approval",
    copy:
      "A different authorized Ernest Rentals reviewer completes final approval under the four-eyes rule.",
  },
  {
    title:
      "Scheduled / Installed",
    copy:
      "Approved artwork is prepared for the confirmed digital schedule or static installation.",
  },
];

const faqs = [
  {
    question:
      "What size should my artwork be?",
    answer:
      "Specifications depend on the selected billboard or digital screen. Contact Ernest Rentals for the latest dimensions and export settings before finalizing artwork.",
  },
  {
    question:
      "Can Ernest Rentals create the advertisement?",
    answer:
      "Creative support may be available depending on the selected package. Choose the creative-help option in the campaign request or contact Sales for confirmation.",
  },
  {
    question:
      "When should I submit final artwork?",
    answer:
      "Submit it early enough to allow review, requested changes, approval and scheduling before the confirmed campaign start date.",
  },
  {
    question:
      "Can artwork be changed after submission?",
    answer:
      "A corrected version can be supplied before final approval. Creative changes during a campaign depend on the selected package and must be confirmed by Ernest Rentals.",
  },
  {
    question:
      "How do I send artwork?",
    answer:
      "Start your campaign request online. After the campaign is confirmed, Sales will provide the appropriate submission method for your image, video or PDF artwork.",
  },
];

export default function ArtworkGuidelinesPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226] print:bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData
            ),
        }}
      />

      <style>{`
        @media print {
          details > :not(summary) {
            display: block !important;
          }

          details summary span {
            display: none !important;
          }
        }
      `}</style>

      <div className="print:hidden">
        <SiteHeader />
      </div>

      <section className="relative overflow-hidden bg-[#071226] px-5 py-20 text-white lg:px-8 lg:py-24 print:bg-white print:px-0 print:py-8 print:text-[#071226]">
        <div className="absolute inset-0 opacity-25 print:hidden">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
            Ernest Rentals Client Creative Guide
          </p>

          <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Billboard Artwork Guidelines
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 print:text-slate-600">
            Prepare effective static and digital billboard artwork for your
            Ernest Rentals campaign in Saint Lucia.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 print:hidden">
            <Link
              href="/#availability"
              className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Start Your Campaign
            </Link>

            <PrintArtworkGuideButton />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 print:px-0 print:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                label:
                  "Standard Digital",
                duration:
                  "10 seconds",
                copy:
                  "Best for one focused message with simple visual movement and concise wording.",
                color:
                  "text-sky-600",
              },
              {
                label:
                  "Premium Digital",
                duration:
                  "15 seconds",
                copy:
                  "Provides more time for visual storytelling or additional campaign information.",
                color:
                  "text-orange-600",
              },
              {
                label:
                  "Premium Shoutout",
                duration:
                  "15 seconds",
                copy:
                  "Designed for celebrations, announcements, events and short promotional messages.",
                color:
                  "text-violet-600",
              },
            ].map(
              (item) => (
                <article
                  key={
                    item.label
                  }
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${item.color}`}>
                    Digital Billboard Artwork
                  </p>
                  <h2 className="mt-3 text-2xl font-black">
                    {item.label}
                  </h2>
                  <p className="mt-2 text-lg font-extrabold text-slate-500">
                    {item.duration}
                  </p>
                  <p className="mt-4 leading-7 text-slate-600">
                    {item.copy}
                  </p>
                </article>
              )
            )}
          </div>

          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-black">
              Confirm specifications before exporting
            </h2>
            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              Digital screen dimensions, pixel resolution, aspect ratio,
              frame rate and file-size limits can change with the selected
              display and production workflow. Contact Ernest Rentals for the
              latest confirmed specifications. Do not resize or export final
              artwork based on assumptions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8 print:px-0 print:py-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Digital Creative Best Practices
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Make every second easy to understand.
            </h2>
            <ul className="mt-6 space-y-3">
              {digitalGuidance.map(
                (item) => (
                  <li
                    key={
                      item
                    }
                    className="rounded-2xl bg-sky-50 px-4 py-3 font-semibold text-slate-700"
                  >
                    ✓ {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Static Billboard Artwork
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Design for long-distance roadside viewing.
            </h2>
            <ul className="mt-6 space-y-3">
              {staticGuidance.map(
                (item) => (
                  <li
                    key={
                      item
                    }
                    className="rounded-2xl bg-orange-50 px-4 py-3 font-semibold text-slate-700"
                  >
                    ✓ {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 print:px-0 print:py-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
            General Design Best Practices
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">
            A clear message is easier to remember.
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {designPrinciples.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item
                  }
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#071226] text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <p className="mt-4 font-bold leading-7 text-slate-700">
                    {item}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#071226] px-5 py-16 text-white lg:px-8 print:bg-white print:px-0 print:py-8 print:text-[#071226]">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-400">
            Content Approval
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            From artwork submission to campaign-ready.
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300 print:text-slate-600">
            Artwork must be reviewed and approved before publication. Ernest
            Rentals maintains version history and uses a four-eyes approval
            process: the person who uploads or submits artwork cannot complete
            the final approval themselves.
          </p>

          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {approvalSteps.map(
              (
                step,
                index
              ) => (
                <li
                  key={
                    step.title
                  }
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 print:border-slate-200 print:bg-slate-50"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-black">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300 print:text-slate-600">
                    {step.copy}
                  </p>
                </li>
              )
            )}
          </ol>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 print:px-0 print:py-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              File Submission
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Start with your campaign request.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Use the existing campaign flow to choose your billboard,
              package and dates. Tell us whether your artwork is ready or if
              creative help is needed. Once the campaign is confirmed, Sales
              will provide the appropriate method for submitting image, video
              or PDF artwork.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              Submit final artwork early enough to allow review, requested
              changes, client confirmation and final approval before your
              campaign start date.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <Link
                href="/#availability"
                className="rounded-xl bg-[#071226] px-5 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
              >
                Search Billboard Availability
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-slate-200 px-5 py-3.5 font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                Contact Ernest Rentals
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-7">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-red-600">
              Restricted Content
            </p>
            <h2 className="mt-3 text-3xl font-black">
              All artwork is subject to approval.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Ernest Rentals may reject or request changes to artwork that
              violates applicable law, contains misleading or unlawful claims,
              is offensive or inappropriate, infringes intellectual property,
              or does not meet the current technical requirements for the
              selected billboard.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8 print:px-0 print:py-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
            Frequently Asked Questions
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Artwork questions, answered.
          </h2>

          <div className="mt-8 space-y-4">
            {faqs.map(
              (item) => (
                <details
                  key={
                    item.question
                  }
                  className="group rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 open:bg-white"
                >
                  <summary className="cursor-pointer list-none font-black text-slate-800">
                    {item.question}
                    <span className="float-right text-orange-500 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-4xl leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </details>
              )
            )}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-orange-500 px-7 py-10 sm:px-10">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#071226]/65">
              Ready to Prepare Your Campaign?
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Choose your billboard before finalizing artwork.
            </h2>
          </div>
          <Link
            href="/#availability"
            className="rounded-xl bg-[#071226] px-6 py-3.5 font-extrabold text-white transition hover:bg-[#0b1a36]"
          >
            Start Your Campaign
          </Link>
        </div>
      </section>

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </main>
  );
}
