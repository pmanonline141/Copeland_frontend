import { CreditCardIcon, FactoryIcon, PackageIcon, RefreshIcon, ShieldCheckIcon, ShirtIcon, TruckIcon, UsersIcon } from "@/components/ui/icons";

const ITEMS = [
  { label: "Verified suppliers only", Icon: FactoryIcon },
  { label: "Every listing moderated", Icon: ShieldCheckIcon },
  { label: "Copeland badge means accountable", Icon: ShirtIcon },
  { label: "Secure payments", Icon: CreditCardIcon },
  { label: "Nationwide & cross-border delivery", Icon: TruckIcon },
  { label: "Bulk & institutional orders", Icon: UsersIcon },
  { label: "Order tracking included", Icon: PackageIcon },
  { label: "Returns & disputes handled", Icon: RefreshIcon },
];

/** Endless marquee of trust signals. Pauses on hover; content is duplicated for a seamless loop. */
export default function TrustStrip() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section aria-label="Why buy with Copeland" className="border-y border-line bg-paper">
      <div className="group relative flex overflow-hidden py-4">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-paper to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-paper to-transparent" />

        <ul className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((item, i) => (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2.5 whitespace-nowrap pr-12 text-sm font-medium text-ink-soft">
              <item.Icon className="h-4 w-4 shrink-0 text-gold-600" />
              {item.label}
              <span aria-hidden className="ml-10 h-1.5 w-1.5 rotate-45 bg-gold/50" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
