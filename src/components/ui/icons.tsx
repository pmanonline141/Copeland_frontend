import type { ReactNode, SVGProps } from "react";

/** Small inline icon set (no extra dependency). Size with className, e.g. "h-5 w-5". */
const make = (paths: ReactNode) =>
  function Icon(props: SVGProps<SVGSVGElement>) {
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
