import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import MenuSection from "@/components/MenuSection";
import FooterSection from "@/components/FooterSection";
import Navbar from "@/components/Navbar";

interface LocationState {
  scrollToId?: string;
}

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.scrollToId) {
      const id = state.scrollToId;
      // Clear location state so scroll doesn't re-trigger on refresh
      navigate(location.pathname, { replace: true, state: {} });
      // Short delay to allow DOM to render before scrolling
      setTimeout(() => {
        if (id === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 150);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <MenuSection />
      <FooterSection />
    </div>
  );
};

export default Index;
