import { MapPin, Clock, Phone, Instagram, ArrowUpRight } from "lucide-react";
import logoHorizontal from "@/assets/logo-horizontal.png";
import { motion } from "framer-motion";

const FooterSection = () => {
  return (
    <footer id="contact" className="py-24 px-6 bg-secondary text-secondary-foreground">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-extrabold font-display tracking-tight">
            Kom langs<span className="text-primary">.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xs font-body font-semibold tracking-[0.3em] uppercase text-primary mb-6">Locatie</h3>
            <div className="flex items-start gap-3 text-secondary-foreground/70 font-body">
              <MapPin className="w-4 h-4 mt-1 shrink-0 text-primary" />
              <span className="text-sm leading-relaxed">It Boumantsje<br />8941 CR Leeuwarden</span>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-body font-semibold tracking-[0.3em] uppercase text-primary mb-6">Open</h3>
            <div className="flex items-start gap-3 text-secondary-foreground/70 font-body">
              <Clock className="w-4 h-4 mt-1 shrink-0 text-primary" />
              <div className="text-sm leading-relaxed">
                <p>Do: 16:00 – 21:00</p>
                <p>Vr: 12:00 – 23:00</p>
                <p>Za: 14:00 – 23:00</p>
                <p>Zo: 14:00 – 21:00</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-body font-semibold tracking-[0.3em] uppercase text-primary mb-6">Contact</h3>
            <div className="flex items-center gap-3 text-secondary-foreground/70 font-body mb-4">
              <Phone className="w-4 h-4 shrink-0 text-primary" />
              <span className="text-sm">058 - 123 4567</span>
            </div>
            <a
              href="https://www.instagram.com/paviljoen_zuidlanden/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-body font-semibold text-sm group"
            >
              <Instagram className="w-4 h-4" />
              @paviljoen_zuidlanden
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="https://dezuidlander.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-body font-semibold text-sm group"
            >
              <ArrowUpRight className="w-4 h-4" />
              De Zuidlander (Wijkpanel)
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logoHorizontal} alt="Paviljoen Zuidlanden" className="h-8 invert" />
          <span className="text-secondary-foreground/30 font-body text-xs tracking-widest uppercase">
            © 2026 Paviljoen Zuidlanden
          </span>
        </div>
      </motion.div>
    </footer>
  );
};

export default FooterSection;
