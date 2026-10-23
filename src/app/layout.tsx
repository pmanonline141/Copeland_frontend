import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import StoreProvider from "@/components/providers/StoreProvider";
import AlertHost from "@/components/ui/AlertHost";
import GlobalLoader from "@/components/ui/GlobalLoader";
import "./globals.css";

// Suggested pairing (the brand guidelines name no fonts). Change here only.
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Copeland | Clothing infrastructure for Nigeria and West Africa", template: "%s | Copeland" },
  description: "Moderated garments from verified suppliers, plus the Copeland label: reviewed, approved and backed by Copeland.",
  openGraph: { title: "Copeland", description: "Reliable clothing for households, firms and institutions.", siteName: "copeland.africa", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#011332" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <StoreProvider>
          {children}
          <GlobalLoader />
          <AlertHost />
        </StoreProvider>
      </body>
    </html>
  );
}
