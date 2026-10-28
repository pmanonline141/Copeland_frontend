import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

/** Public site shell: announcement + header, page content, then the footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
