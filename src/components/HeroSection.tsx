import { motion } from "framer-motion";
import heroImage from "@/assets/hero-fries.jpg";
import logo from "@/assets/logo-terracotta.png";
import Wordmark from "@/components/Wordmark";
import WaveDivider from "@/components/WaveDivider";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }} />
      
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/70 to-secondary" />
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
        <motion.div
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto mb-8 sm:mb-12 rounded-xl sm:rounded-2xl shadow-2xl ring-2 ring-primary/20 overflow-hidden"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}>
          <img
            src={logo}
            alt="Paviljoen Zuidlanden logo"
            className="w-full h-full object-cover" />
        </motion.div>
        
        <motion.h1
          className="sr-only"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}>
          Paviljoen Zuidlanden — de plek om samen te komen
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6">
          <Wordmark size="lg" tone="light" tagline />
        </motion.div>
        <motion.p
          className="text-base md:text-xl text-secondary-foreground/60 font-body font-light tracking-wide mb-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}>
          
          Dé ontmoetingsplek van Leeuwarden-Zuid
        </motion.p>
        <motion.p
          className="text-sm text-secondary-foreground/40 font-body tracking-[0.3em] uppercase mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}>
          
          Verse friet · Rustieke friet met schil · Borrels · Events
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}>
          
          <a
            href="#menu"
            className="bg-primary text-primary-foreground px-10 py-4 rounded-full text-sm font-body font-semibold tracking-widest uppercase hover:scale-105 transition-transform">
            
            Bekijk Menu
          </a>
          <a
            href="#over-ons"
            className="border-2 border-secondary-foreground/20 text-secondary-foreground px-10 py-4 rounded-full text-sm font-body font-semibold tracking-widest uppercase hover:border-primary hover:text-primary transition-all">
            
            Over ons
          </a>
        </motion.div>
      </div>

      {/* Brand wave into the next section */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <WaveDivider className="text-background" stroke="hsl(var(--primary))" />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
        
        <div className="w-5 h-8 border-2 border-secondary-foreground/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>);

};

export default HeroSection;