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
      <div className="absolute inset-0 bg-foreground/60" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.img
          src={logo}
          alt="Paviljoen Zuidlanden logo"
          className="w-28 h-28 mx-auto mb-10 rounded-2xl object-cover shadow-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.h1
          className="text-6xl md:text-9xl font-bold text-background mb-6 font-display tracking-tight uppercase"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Paviljoen<br />Zuidlanden
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-background/70 font-body font-light tracking-wide mb-4 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Dé ontmoetingsplek van Leeuwarden-Zuid
        </motion.p>
        <motion.p
          className="text-sm md:text-base text-background/50 font-body tracking-widest uppercase mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Verse friet · Gezellige borrels · Feesten & events
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <a
            href="#menu"
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-lg text-base font-body font-semibold tracking-wide uppercase hover:brightness-110 transition-all"
          >
            Bekijk het menu
          </a>
          <a
            href="#over-ons"
            className="border-2 border-background/30 text-background px-8 py-3.5 rounded-lg text-base font-body font-semibold tracking-wide uppercase hover:border-background/60 transition-all"
          >
            Over ons
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-background/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-background/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
