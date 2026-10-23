import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { MenuHighlights } from "@/components/landing/MenuHighlights";
import { CoffeeSection } from "@/components/landing/CoffeeSection";
import { LocationsSection } from "@/components/landing/LocationsSection";
import { MediaPlaceholder } from "@/components/landing/MediaPlaceholder";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div id="inicio" className="min-h-screen flex flex-col bg-brand-latte">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MenuHighlights />
        <CoffeeSection />
        <LocationsSection />
        <MediaPlaceholder />
      </main>
      <Footer />
    </div>
  );
}
