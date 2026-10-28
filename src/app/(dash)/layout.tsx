import DashboardShell from "@/components/dashboard/DashboardShell";

/** Every role area (/buyer, /supplier, /shipping, /admin) shares this chrome. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
