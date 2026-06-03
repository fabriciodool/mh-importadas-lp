import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BrandsSection from "@/components/BrandsSection";
import ProductsSection from "@/components/ProductsSection";
import HowItWorks from "@/components/HowItWorks";
import PremiumSection from "@/components/PremiumSection";
import CoverageSection from "@/components/CoverageSection";
import FAQ from "@/components/FAQ";
import FormCTA from "@/components/FormCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BrandsSection />
        <ProductsSection />
        <HowItWorks />
        <PremiumSection />
        <CoverageSection />
        <FAQ />
        <FormCTA />
      </main>
      <Footer />
    </>
  );
}
