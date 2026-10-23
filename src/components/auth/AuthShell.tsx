import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { ArrowRightIcon, ShieldCheckIcon, ShirtIcon, TruckIcon } from "@/components/ui/icons";

const PROMISES = [
  { icon: ShieldCheckIcon, title: "Moderated listings", text: "Every supplier product is reviewed before it goes live." },
  { icon: ShirtIcon, title: "The Copeland badge", text: "Reviewed, approved, and Copeland is accountable for it." },
  { icon: TruckIcon, title: "Visible orders", text: "Follow each order from supplier to your door." },
];

/** Split-screen shell shared by every auth page: brand panel on the left (desktop), form on the right. */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.02fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy p-12 text-white lg:flex xl:p-16">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div aria-hidden className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(183_141_68/0.30),transparent)]" />
        <div aria-hidden className="absolute -right-24 -top-24 h-[22rem] w-[22rem] rounded-full border border-gold/20" />
        <div aria-hidden className="absolute -bottom-32 -left-24 h-[26rem] w-[26rem] rounded-full border border-gold/15" />

        <Link href="/" aria-label="Copeland Clothiers, home" className="relative w-fit">
          <Logo variant="reversed" className="h-20 mix-blend-lighten" />
        </Link>

        <div className="relative max-w-lg">
          <p className="eyebrow !text-gold-300">copeland.africa</p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.1] text-white xl:text-5xl">
            Clothing you can rely on, <span className="italic text-gold-300">from order to delivery.</span>
          </h2>
          <ul className="mt-10 space-y-5">
            {PROMISES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-white/5 text-gold-300"><Icon className="h-5 w-5" /></span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm text-white/65">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/50">Copeland Clothiers Limited · RC 9420502</p>
      </aside>

      <div className="flex min-h-screen flex-col bg-ivory">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:justify-end">
          <Link href="/" aria-label="Copeland Clothiers, home" className="lg:hidden"><Logo className="h-14" /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
            Back to shop <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <main className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
          <div className="w-full max-w-[26rem] animate-fade-up">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-base text-ink-soft">{subtitle}</p>}
    </div>
  );
}
