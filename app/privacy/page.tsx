import type { Metadata } from "next";

import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/contact-details";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ernestrentals.com"
).replace(/\/$/, "");

const lastUpdated = "September 28, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Ernest Rentals collects, uses, stores and shares personal information when you use our Saint Lucia billboard advertising website.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Ernest Rentals",
    description:
      "How Ernest Rentals handles information submitted through campaign requests, meeting scheduling and billboard reviews.",
    url: "/privacy",
    siteName: "Ernest Rentals",
    locale: "en_LC",
    type: "website",
  },
};

const sections = [
  { href: "#information-we-collect", label: "Information we collect" },
  { href: "#how-we-use-information", label: "How we use it" },
  { href: "#cookies-and-analytics", label: "Cookies and analytics" },
  { href: "#sharing", label: "Sharing and providers" },
  { href: "#retention", label: "Retention" },
  { href: "#your-rights", label: "Your rights" },
  { href: "#contact-us", label: "Contact us" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": siteUrl + "/privacy#webpage",
  url: siteUrl + "/privacy",
  name: "Privacy Policy",
  description:
    "The Ernest Rentals privacy policy for website visitors and advertising customers.",
  isPartOf: {
    "@id": siteUrl + "/#website",
  },
  about: {
    "@id": siteUrl + "/#organization",
  },
  dateModified: "2026-09-28",
  inLanguage: "en-LC",
};

function PolicySection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-b border-slate-200 py-10 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-black text-orange-600">
          {number}
        </span>

        <div className="min-w-0">
          <h2 className="text-2xl font-black tracking-tight text-[#071226] sm:text-3xl">
            {title}
          </h2>

          <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f8fc] text-[#071226]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <SiteHeader />

      <section className="relative overflow-hidden bg-[#071226] px-5 py-16 text-white lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
            Privacy at Ernest Rentals
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Clear information about how we handle your data.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            This policy explains what Ernest Rentals collects when you explore
            billboard advertising, send a campaign request, schedule a meeting
            or submit a review through our website.
          </p>

          <p className="mt-6 text-sm font-bold text-slate-400">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8 lg:py-16">
        <div className="mx-auto grid min-w-0 max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="min-w-0 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                On this page
              </p>

              <nav aria-label="Privacy policy sections" className="mt-4 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.href}
                    href={section.href}
                    className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>

              <div className="mt-6 rounded-2xl bg-[#071226] p-5 text-white">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-orange-400">
                  Privacy question?
                </p>

                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20Request`}
                  className="mt-3 block break-words text-sm font-extrabold transition hover:text-orange-300"
                >
                  {CONTACT_EMAIL}
                </a>

                <a
                  href={`tel:${CONTACT_PHONE_E164}`}
                  className="mt-2 block text-sm font-bold text-slate-300 transition hover:text-white"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </aside>

          <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              {[
                ["No data sales", "We do not sell or rent your personal information."],
                [
                  "No ad tracking",
                  "The current website does not use advertising pixels or behavioural analytics.",
                ],
                [
                  "Real choices",
                  "You can ask about, correct or request deletion of your information.",
                ],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl bg-slate-50 p-5">
                  <p className="font-black text-[#071226]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                </div>
              ))}
            </div>

            <PolicySection id="about-this-policy" number="01" title="About this policy">
              <p>
                Ernest Rentals provides static and digital billboard advertising
                services in Saint Lucia. In this policy, “Ernest Rentals”, “we”,
                “us” and “our” refer to the business operating this website and
                handling the personal information described below.
              </p>

              <p>
                This policy applies to{" "}
                <a
                  href="https://www.ernestrentals.com"
                  className="font-bold text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700"
                >
                  www.ernestrentals.com
                </a>
                , including its billboard search, campaign-request, meeting and
                review features. It does not control the privacy practices of
                third-party websites you choose to visit.
              </p>
            </PolicySection>

            <PolicySection
              id="information-we-collect"
              number="02"
              title="Information we collect"
            >
              <h3 className="font-black text-[#071226]">Campaign requests</h3>
              <p>
                When you request a campaign, we may collect your name, company,
                email address, phone or WhatsApp number, selected billboard,
                campaign dates and package, campaign name and objective, artwork
                readiness, and any message you include. This becomes a lead in
                our customer-management system so our team can respond and plan
                the requested advertising service.
              </p>

              <h3 className="pt-2 font-black text-[#071226]">
                Meeting scheduling
              </h3>
              <p>
                When you schedule a meeting, we collect your name and email
                address, and may collect your company, phone number and meeting
                notes. We also record the meeting type, date, time and status.
                Your email address is added as an attendee to the Google Calendar
                event so the invitation and updates can be delivered to you.
              </p>

              <h3 className="pt-2 font-black text-[#071226]">
                Billboard reviews
              </h3>
              <p>
                If you submit a review, we collect your name, email address,
                rating and review text, plus your company and review title if you
                provide them. Reviews are moderated. If approved, your name,
                company, rating, title and review may be displayed publicly; your
                email address is not included in the public review data.
              </p>

              <h3 className="pt-2 font-black text-[#071226]">
                Direct communications
              </h3>
              <p>
                If you contact us by email, telephone or WhatsApp, we receive the
                contact details and message content you choose to provide. Those
                services may also process information under their own privacy
                terms.
              </p>

              <h3 className="pt-2 font-black text-[#071226]">
                Technical and security information
              </h3>
              <p>
                Our hosting and infrastructure providers may automatically
                process technical information such as your IP address, browser or
                device information, requested pages, timestamps, referring pages
                and error data in order to deliver and protect the site. For
                campaign submissions, meeting availability checks and meeting
                bookings, the site converts the requesting IP address into a
                one-way cryptographic fingerprint for rate limiting. It also uses
                a one-way fingerprint of a contact detail or email address to
                reduce spam and repeated submissions.
              </p>
            </PolicySection>

            <PolicySection
              id="how-we-use-information"
              number="03"
              title="How we use information"
            >
              <p>We use personal information to:</p>

              <ul className="list-disc space-y-2 pl-5 marker:text-orange-500">
                <li>respond to questions and campaign requests;</li>
                <li>
                  confirm billboard availability, prepare proposals and manage
                  advertising relationships;
                </li>
                <li>
                  show available meeting times, create calendar events and send
                  meeting invitations or updates;
                </li>
                <li>moderate and publish approved billboard reviews;</li>
                <li>
                  operate, troubleshoot and secure the website, including
                  preventing spam, abuse and duplicate bookings;
                </li>
                <li>
                  maintain business, accounting and service records, and meet
                  legal or regulatory obligations; and
                </li>
                <li>
                  establish, exercise or defend legal claims and protect our
                  customers, staff and business.
                </li>
              </ul>

              <p>
                Depending on the circumstances, we process information because
                you asked us to take steps toward providing a service, because it
                is needed to perform an agreement, with your consent, to meet a
                legal obligation, or for legitimate operational and security
                interests that do not override your rights.
              </p>
            </PolicySection>

            <PolicySection
              id="cookies-and-analytics"
              number="04"
              title="Cookies, analytics and external content"
            >
              <p>
                At the date shown above, the website code does not use Google
                Analytics, advertising pixels, behavioural analytics tools or
                other non-essential first-party tracking cookies. We do not use
                website activity to build advertising profiles.
              </p>

              <p>
                The site does use normal network requests and server logs needed
                to load pages, search billboard availability, prevent abuse and
                diagnose errors. Billboard pages may load an embedded Google Map,
                and some website media is delivered from Supabase storage. When
                those resources load, the relevant provider receives technical
                request information and may use cookies or similar technologies
                under its own policies.
              </p>

              <p>
                Links for Google Maps, WhatsApp, Facebook and LinkedIn take you to
                third-party services only when you use them. Their privacy and
                cookie practices are controlled by those companies, not Ernest
                Rentals. If we introduce non-essential analytics or advertising
                technologies in the future, we will update this policy and use
                consent controls where required.
              </p>
            </PolicySection>

            <PolicySection id="sharing" number="05" title="Sharing and service providers">
              <p>
                We do not sell or rent personal information. We share information
                only when needed for the purposes in this policy, including with:
              </p>

              <ul className="list-disc space-y-3 pl-5 marker:text-orange-500">
                <li>
                  <strong className="text-[#071226]">Supabase</strong>, which
                  provides database and media-storage infrastructure for website,
                  lead, review and meeting information;
                </li>
                <li>
                  <strong className="text-[#071226]">Google Calendar</strong>,
                  which is used to check free/busy availability and create the
                  meeting event you request;
                </li>
                <li>
                  <strong className="text-[#071226]">our website host and
                  infrastructure providers</strong>, which deliver the website and
                  may process request, security and error logs;
                </li>
                <li>
                  authorised Ernest Rentals staff and contractors who need the
                  information to respond to you or provide the requested service;
                </li>
                <li>
                  professional advisers, insurers, payment or business partners
                  where necessary for a transaction or dispute; and
                </li>
                <li>
                  public authorities or other parties when required by law, a
                  lawful request, or to protect rights, safety and security.
                </li>
              </ul>

              <p>
                Some providers may process information outside Saint Lucia or the
                wider Caribbean. When information is transferred internationally,
                we take reasonable steps to use providers and arrangements that
                protect it consistently with applicable law.
              </p>
            </PolicySection>

            <PolicySection id="retention" number="06" title="How long we keep information">
              <p>
                We keep personal information only for as long as reasonably
                necessary for the purpose for which it was collected. The period
                depends on whether the information relates to an inquiry, active
                or completed campaign, meeting, published review, security event,
                accounting record, dispute or legal obligation.
              </p>

              <p>
                Campaign and customer records may be kept while we manage the
                relationship and for a reasonable period afterward. Meeting
                records and calendar events may remain as business records.
                Approved reviews may remain public until removed or no longer
                relevant. Security fingerprints and logs are kept only as needed
                for abuse prevention, troubleshooting and system integrity. When
                information is no longer needed, we delete it, anonymise it or
                restrict its use, subject to backup and legal-record requirements.
              </p>
            </PolicySection>

            <PolicySection id="security" number="07" title="How we protect information">
              <p>
                We use reasonable administrative and technical safeguards suited
                to the nature of the information. The website routes sensitive
                campaign and meeting submissions through protected server
                endpoints, limits repeated requests, uses one-way fingerprints
                instead of retaining raw contact or IP values for rate-limit keys,
                and restricts operational records to authorised access.
              </p>

              <p>
                No internet transmission or storage system is completely secure.
                Please avoid placing sensitive financial, medical, identity or
                other unnecessary confidential information in free-text message
                fields.
              </p>
            </PolicySection>

            <PolicySection id="your-rights" number="08" title="Your choices and rights">
              <p>
                Subject to applicable law and any lawful exceptions, you may ask
                us to confirm whether we hold personal information about you and
                request access to, correction of or deletion of that information.
                You may also object to or ask us to restrict certain processing,
                withdraw consent where processing relies on consent, or ask a
                question about how your information is used.
              </p>

              <p>
                To protect you, we may need to verify your identity before acting
                on a request. We may retain information that we are legally
                required to keep or that is needed to complete a service, resolve
                a dispute, prevent fraud or protect legal rights. You may also
                raise a concern with the relevant data-protection authority.
              </p>

              <p>
                Ernest Rentals operates in Saint Lucia. This policy is intended
                to be read consistently with Saint Lucia&apos;s applicable privacy
                and data-protection requirements. Visitors from other places may
                have additional rights under the laws that apply to them.
              </p>
            </PolicySection>

            <PolicySection id="childrens-privacy" number="09" title="Children's privacy">
              <p>
                The website and our advertising services are intended for
                businesses and adults. They are not directed to children under
                18, and we do not knowingly collect personal information from
                children through the website. If you believe a child has provided
                information to us, please contact us so we can review and remove
                it where appropriate.
              </p>
            </PolicySection>

            <PolicySection id="changes" number="10" title="Changes to this policy">
              <p>
                We may update this policy when our website, service providers or
                legal obligations change. We will post the revised version on
                this page and update the date at the top. Material changes may be
                highlighted on the website or communicated directly when
                appropriate.
              </p>
            </PolicySection>

            <PolicySection id="contact-us" number="11" title="Contact us">
              <p>
                For a privacy question or request, contact Ernest Rentals and
                include enough detail for us to understand the request. Please do
                not send identity documents unless we ask for a specific form of
                verification.
              </p>

              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20Request`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-300 hover:bg-orange-50"
                >
                  <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                    Email
                  </span>
                  <span className="mt-2 block break-words font-black text-[#071226]">
                    {CONTACT_EMAIL}
                  </span>
                </a>

                <a
                  href={`tel:${CONTACT_PHONE_E164}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-300 hover:bg-orange-50"
                >
                  <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                    Telephone
                  </span>
                  <span className="mt-2 block font-black text-[#071226]">
                    {CONTACT_PHONE_DISPLAY}
                  </span>
                </a>
              </div>

              <p className="pt-2">
                You can also visit our{" "}
                <Link
                  href="/contact"
                  className="font-bold text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700"
                >
                  contact page
                </Link>{" "}
                for our current contact options.
              </p>
            </PolicySection>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
