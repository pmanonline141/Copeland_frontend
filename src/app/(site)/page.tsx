import BadgeExplainer from "@/components/home/BadgeExplainer";
import CategoryGrid from "@/components/home/CategoryGrid";
import CopelandLabel from "@/components/home/CopelandLabel";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Newsletter from "@/components/home/Newsletter";
import SupplierCta from "@/components/home/SupplierCta";
import TrustStrip from "@/components/home/TrustStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <CopelandLabel />
      <FeaturedProducts />
      <BadgeExplainer />
      <HowItWorks />
      <SupplierCta />
      <Newsletter />
    </>
  );
}
