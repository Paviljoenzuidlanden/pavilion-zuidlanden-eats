import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Agenda from "./pages/Agenda";
import Bezorging from "./pages/Bezorging";
import Menukaart from "./pages/Menukaart";
import Bestellen from "./pages/Bestellen";
import Personeel from "./pages/Personeel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/feest" element={<Events />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/bezorging" element={<Bezorging />} />
          <Route path="/menukaart" element={<Menukaart />} />
          <Route path="/bestellen" element={<Bestellen />} />
          <Route path="/personeel" element={<Personeel />} />
          {/* Section anchor aliases so direct links like /#friet never 404 */}
          <Route path="/friet" element={<Navigate to="/menukaart" state={{ scrollToId: "friet" }} replace />} />
          <Route path="/rustiek" element={<Navigate to="/menukaart" state={{ scrollToId: "rustiek" }} replace />} />
          <Route path="/snacks" element={<Navigate to="/menukaart" state={{ scrollToId: "snacks" }} replace />} />
          <Route path="/broodjes" element={<Navigate to="/menukaart" state={{ scrollToId: "broodjes" }} replace />} />
          <Route path="/extra" element={<Navigate to="/menukaart" state={{ scrollToId: "extra" }} replace />} />
          <Route path="/menu" element={<Navigate to="/" state={{ scrollToId: "menu" }} replace />} />
          <Route path="/over-ons" element={<Navigate to="/" state={{ scrollToId: "over-ons" }} replace />} />
          <Route path="/contact" element={<Navigate to="/" state={{ scrollToId: "contact" }} replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
