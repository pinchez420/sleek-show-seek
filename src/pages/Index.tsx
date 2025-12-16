import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EventsGrid from "@/components/EventsGrid";
import TrendingSection from "@/components/TrendingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        {/* We removed <CategoryFilter /> here because it is now inside EventsGrid */}
        <EventsGrid />
        <TrendingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
