import type { ReactNode, SVGProps } from "react";

/** Small inline icon set (no extra dependency). Size with className, e.g. "h-5 w-5". */
const make = (paths: ReactNode) =>
  function Icon(props: SVGProps<SVVGElement>) {
    return (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        {paths}
      </svg>
    );
  };

export const SearchIcon = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const BagIcon = make(<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>);
export const UserIcon = make(<><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 14.5-4 16 0" /></>);
export const MenuIcon = make(<><path d="M4 7h16M4 12h16M4 17h16" /></>);
export const CloseIcon = make(<><path d="m6 6 12 12M18 6 6 18" /></>);
export const ArrowRightIcon = make(<><path d="M5 12h14M13 6l6 6-6 6" /></>);
export const CheckIcon = make(<><path d="m5 12.5 4.5 4.5L19 7.5" /></>);
export const ShieldCheckIcon = make(<><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>);
export const TruckIcon = make(<><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>);
export const ShirtIcon = make(<><path d="M8 3 3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0Z" /></>);
export const EyeIcon = make(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>);
export const EyeOffIcon = make(<><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6A17 17 0 0 0 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>);
export const MailIcon = make(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>);
export const AlertIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.01" /></>);
export const LockIcon = make(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);

/* --- Navigation & controls --- */
export const ChevronDownIcon = make(<><path d="m6 9 6 6 6-6" /></>);
export const ChevronRightIcon = make(<><path d="m9 6 6 6-6 6" /></>);
export const ChevronLeftIcon = make(<><path d="m15 6-6 6 6 6" /></>);
export const PlusIcon = make(<><path d="M12 5v14M5 12h14" /></>);
export const MinusIcon = make(<><path d="M5 12h14" /></>);
export const TrashIcon = make(<><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></>);
export const FilterIcon = make(<><path d="M3 5h18M6 12h12M10 19h4" /></>);
export const GridIcon = make(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>);

/* --- Arrows & misc --- */
export const ArrowUpRightIcon = make(<><path d="M7 17 17 7M8 7h9v9" /></>);
export const HeartIcon = make(<><path d="M12 20s-7-4.35-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5c0 5.15-7 9.5-7 9.5Z" /></>);
export const StarIcon = make(<><path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z" /></>);
export const SparklesIcon = make(<><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6.3 6.3 3.5 3.5M20.5 3.5l-2.8 2.8M6.3 17.7l-2.8 2.8M20.5 20.5l-2.8-2.8" /><circle cx="12" cy="12" r="3" /></>);
export const QuoteIcon = make(<><path d="M9 7c-3 1-5 3.5-5 7v3h5v-6H6c0-2 1-3 3-3V7ZM19 7c-3 1-5 3.5-5 7v3h5v-6h-3c0-2 1-3 3-3V7Z" /></>);
export const PlayIcon = make(<><circle cx="12" cy="12" r="9" /><path d="m10 8.5 6 3.5-6 3.5v-7Z" /></>);
export const PauseIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M10 9v6M14 9v6" /></>);

/* --- Commerce & fulfilment --- */
export const PackageIcon = make(<><path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></>);
export const TagIcon = make(<><path d="M3.5 11.5 11 4h8v8l-7.5 7.5-8-8Z" /><circle cx="15.5" cy="8.5" r="1.3" /></>);
export const CreditCardIcon = make(<><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19" /></>);
export const MapPinIcon = make(<><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></>);
export const PhoneIcon = make(<><path d="M5 4h3.5l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L15 13l4 1.5V18a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" /></>);
export const ClockIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></>);
export const LogOutIcon = make(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>);
export const RefreshIcon = make(<><path d="M20 11a8 8 0 0 0-14-4.5L4 8M4 5v3.5h3.5M4 13a8 8 0 0 0 14 4.5l2-1.5M20 19v-3.5h-3.5" /></>);
export const SendIcon = make(<><path d="M21 3 10.5 13.5M21 3l-7 18-3.5-7.5L3 10l18-7Z" /></>);
export const UploadIcon = make(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></>);
export const DownloadIcon = make(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>);

/* --- People, partners & trust --- */
export const GlobeIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>);
export const FactoryIcon = make(<><path d="M3 20V10l5 3V10l5 3V9l6 3v8H3Z" /><path d="M7 20v-3h3v3M7 4h3v3H7z" /></>);
export const BuildingIcon = make(<><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" /></>);
export const UsersIcon = make(<><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c1.2-3.6 11.8-3.6 13 0" /><path d="M16 5.5a3 3 0 0 1 0 5.6M17.5 14.5c2.2.5 3.6 1.8 4 5.5" /></>);
export const AwardIcon = make(<><circle cx="12" cy="9" r="5.5" /><path d="m8.5 13.5-1 7.5 4.5-2.5 4.5 2.5-1-7.5" /></>);
export const RulerIcon = make(<><path d="M3.5 14.5 14.5 3.5l6 6-11 11-6-6Z" /><path d="m7 11 2 2M10 8l2 2M13 5l2 2" /></>);
export const LeafIcon = make(<><path d="M20 4c-9 0-14 4-14 10a6 6 0 0 0 1 3.5C8 20 4 20 4 20s1.5-3 1-5C4.2 11 8 4 20 4Z" /><path d="M14 10c-2 0-4 1.5-5 3.5" /></>);
export const StoreIcon = make(<><path d="M4 9.5 5.5 4h13L20 9.5M4 9.5V20h16V9.5M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /><path d="M10 20v-5h4v5" /></>);

/* --- Social (filled glyphs) --- */
const makeFilled = (paths: ReactNode) =>
  function Icon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        {paths}
      </svg>
    );
  };

export const InstagramIcon = makeFilled(<path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .5 1.4.95.45.4.73.8.95 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2a3.8 3.8 0 0 1-.95 1.4c-.4.45-.8.73-1.4.95-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42a3.8 3.8 0 0 1-1.4-.95 3.8 3.8 0 0 1-.95-1.4c-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.6.5-1 .95-1.4.4-.45.8-.73 1.4-.95.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 3.35A6.45 6.45 0 1 0 18.45 12 6.45 6.45 0 0 0 12 5.55Zm0 10.64A4.19 4.19 0 1 1 16.19 12 4.19 4.19 0 0 1 12 16.19Zm6.7-10.9a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5Z" />);
export const LinkedInIcon = makeFilled(<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0H13v1.7h.05a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5V21h-4v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z" />);
export const XIcon = makeFilled(<path d="M17.6 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L5 21H1.8l7.5-8.6L1.4 3H8l4.5 5.6L17.6 3Zm-1.1 16h1.8L7.6 4.9H5.7L16.5 19Z" />);
export const FacebookIcon = makeFilled(<path d="M13.5 21v-8h2.7l.4-3h-3.1V8.2c0-.9.25-1.5 1.5-1.5h1.7V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H7.8v3h2.6v8h3.1Z" />);
export const WhatsAppIcon = makeFilled(<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.5-5.9c-.25-.12-1.5-.73-1.7-.82s-.4-.12-.6.12-.7.8-.8 1-.25.15-.5 0a6.6 6.6 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.6c-.13-.25 0-.4.1-.5s.25-.3.37-.45a1.7 1.7 0 0 0 .25-.4.5.5 0 0 0 0-.45c0-.12-.6-1.4-.8-1.9s-.4-.4-.5-.4h-.45a.85.85 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9 4.3 4.3 0 0 0 .9 2.3 9.9 9.9 0 0 0 3.8 3.4c2.1.8 2.1.55 2.5.5a2.3 2.3 0 0 0 1.5-1 1.9 1.9 0 0 0 .1-1c-.05-.1-.2-.15-.45-.27Z" />);
