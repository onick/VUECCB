'use client';

import { useAuthStore } from "@/stores/auth";
import { MainNav } from "@/components/layout/main-nav";
import AdminSidebar from "@/components/AdminSidebar";
import { HeroSection } from "@/components/features/hero-section";
import { EventsGrid } from "@/components/features/events-grid";
import { StatsSection } from "@/components/features/stats-section";

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.is_admin;

  if (isAdmin) {
    // Si es admin, usar layout similar al admin con sidebar
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar para admin */}
        <div className="fixed left-0 top-0 h-full z-30">
          <AdminSidebar />
        </div>

        {/* Main Content Area - Con margen para el sidebar */}
        <div className="lg:ml-[280px] min-h-screen transition-all duration-300">
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <HeroSection />
              <EventsGrid />
              <StatsSection />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Si no es admin, usar layout normal con MainNav
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
