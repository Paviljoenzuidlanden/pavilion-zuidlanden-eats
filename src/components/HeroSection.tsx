import { motion } from "framer-motion";
import heroImage from "@/assets/hero-fries.jpg";
import logo from "@/assets/logo.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-secondary/70" />
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.img
          src={logo}
          alt="Paviljoen Zuidlanden logo"
          className="w-40 h-40 mx-auto mb-8 rounded-full object-contain bg-background/90 p-2 shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4 font-display"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Paviljoen Zuidlanden
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-primary-foreground/80 font-body font-light tracking-wide mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Verse friet met velletje · Ambachtelijk bereid
        </motion.p>
        <motion.a
          href="#menu"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-sm text-lg font-body font-medium tracking-wider uppercase hover:brightness-110 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Bekijk het menu
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/70 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
