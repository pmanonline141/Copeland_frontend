import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { CheckIcon, InstagramIcon, MailIcon, MapPinIcon, ShieldCheckIcon, TruckIcon } from "@/components/ui/icons";

/**
 * MVP footer: only links to pages that belong to the first release.
 * Re-add columns (Partner standards, Quality standards, Schools, Government, Cookies, Returns policy...) when those pages exist.
 */
const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All garments" },
      { href: "/shop?category=women", label: "Women" },
      { href: "/shop?category=men", label: "Men" },
      { href: "/shop?category=uniforms", label: "Uniforms & workwear" },
    ],
  },
  {
    title: "Copeland",
    links: [
      { href: "/copeland", label: "The Copeland label" },
      { href: "/about/badge", label: "The Copeland badge" },
      { href: "/track", label: "Track an order" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "For business",
    links: [
      { href: "/rfq", label: "Request a quote" },
      { href: "/partners/apply", label: "Sell with us" },
      { href: "/partners/apply?type=shipping", label: "Ship with us" },
      { href: "/login", label: "Partner sign in" },
    ],
  },
];

/** From the brand package: Social @wearcopeland. Add other networks only once the accounts exist. */
const INSTAGRAM = "https://instagram.com/wearcopeland";

/** Replace with real details. The phone number is left out until there is one to show. */
const CONTACT = { email: "hello@copeland.africa", address: "Copeland Clothiers Limited, Lagos, Nigeria" };

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container">
        {/* Brand + link columns */}
        <div className="grid gap-12 border-b border-white/10 py-12 lg:grid-cols-[1.2fr_1.8fr] lg:gap-16 lg:py-14">
          <div>
            <Link href="/" aria-label="Copeland Clothiers, home" className="inline-block">
              <Logo variant="reversed" className="h-10" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Clothing infrastructure for Nigeria and West Africa. Verified suppliers, moderated listings, and the
              Copeland label.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                {CONTACT.address}
              </li>
              <li className="flex items-start gap-3">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                <a href={`mailto:${CONTACT.email}`} className="link-underline hover:text-white">{CONTACT.email}</a>
              </li>
            </ul>

            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2.5 text-sm font-semibold text-white/80 transition-colors duration-fast hover:text-gold-300"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors duration-fast group-hover:border-gold">
                <InstagramIcon className="h-4 w-4" />
              </span>
              @wearcopeland
            </a>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-300">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="link-underline text-sm text-white/70 transition-colors duration-fast hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Trust line: one distinct icon each */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-white/10 py-5 text-sm text-white/70">
          <span className="flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-gold-300" /> Verified suppliers
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-gold-300" /> Every listing moderated
          </span>
          <span className="flex items-center gap-2">
            <TruckIcon className="h-4 w-4 text-gold-300" /> Order tracking included
          </span>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} Copeland Clothiers Limited · RC 9420502. All rights reserved.
          </p>
          <ul className="flex items-center gap-x-6 text-xs text-white/55">
            <li><Link href="/legal/privacy" className="link-underline hover:text-white">Privacy</Link></li>
            <li><Link href="/legal/terms" className="link-underline hover:text-white">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}