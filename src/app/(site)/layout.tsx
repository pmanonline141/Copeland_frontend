import Header from "@/components/layout/Header";

/** Public site shell. The Footer joins in a later step. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
    </>
  );
}
