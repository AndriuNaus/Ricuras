import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { MenuHighlights } from "@/components/landing/MenuHighlights";
import { CoffeeSection } from "@/components/landing/CoffeeSection";
import { LocationsSection } from "@/components/landing/LocationsSection";
import { Reviews } from "@/components/landing/Reviews";
import { InstagramSection } from "@/components/landing/InstagramSection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-ricuras-crema text-ricuras-carbon font-body">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MenuHighlights />
        <CoffeeSection />
        <LocationsSection />
        <Reviews />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  );
}
