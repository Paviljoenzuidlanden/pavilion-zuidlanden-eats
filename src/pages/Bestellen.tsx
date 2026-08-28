import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const Bestellen = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-body text-xs font-semibold tracking-[0.4em] uppercase">
              Online bestellen
            </span>
            <h1 className="text-5xl md:text-8xl font-extrabold text-foreground mt-4 font-display tracking-tight">
              Bestellen<span className="text-primary">.</span>
            </h1>
          </motion.div>

          <motion.div
            className="bg-card rounded-3xl p-8 sm:p-16 border border-border text-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-8">
              <Clock className="w-10 h-10" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 font-display tracking-tight">
              Binnenkort beschikbaar<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground font-body text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Online bestellen is nog niet gereed. We werken er hard aan om dit zo snel mogelijk voor je beschikbaar te maken.
            </p>
          </motion.div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Bestellen;
