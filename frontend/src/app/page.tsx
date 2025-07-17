import { MainNav } from "@/components/layout/main-nav";
import { HeroSection } from "@/components/features/hero-section";
import { EventsGrid } from "@/components/features/events-grid";
import { StatsSection } from "@/components/features/stats-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <HeroSection />
        <EventsGrid />
        <StatsSection />
      </main>
    </div>
  );
}
