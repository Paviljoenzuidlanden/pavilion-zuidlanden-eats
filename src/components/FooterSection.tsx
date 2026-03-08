import { MapPin, Clock, Phone, Instagram } from "lucide-react";
import { motion } from "framer-motion";

const FooterSection = () => {
  return (
    <footer id="contact" className="py-20 px-4 bg-foreground text-background">
      <motion.div
        className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h3 className="text-lg font-bold font-display mb-4 text-primary uppercase tracking-wide">Locatie</h3>
          <div className="flex items-start justify-center md:justify-start gap-3 text-background/70 font-body">
            <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
            <span>It Boumantsje<br />8941 CR Leeuwarden</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold font-display mb-4 text-primary uppercase tracking-wide">Openingstijden</h3>
          <div className="flex items-start justify-center md:justify-start gap-3 text-background/70 font-body">
            <Clock className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
            <div>
              <p>Do: 16:00 – 21:00</p>
              <p>Vr: 12:00 – 23:00</p>
              <p>Za: 14:00 – 23:00</p>
              <p>Zo: 14:00 – 21:00</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold font-display mb-4 text-primary uppercase tracking-wide">Contact</h3>
          <div className="flex items-center justify-center md:justify-start gap-3 text-background/70 font-body mb-4">
            <Phone className="w-5 h-5 shrink-0 text-primary" />
            <span>058 - 123 4567</span>
          </div>
          <a
            href="https://instagram.com/paviljoen.zuidlanden"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-body font-semibold"
          >
            <Instagram className="w-5 h-5" />
            @paviljoen.zuidlanden
          </a>
        </div>
      </motion.div>
      <div className="text-center mt-16 text-background/30 font-body text-sm tracking-wide uppercase">
        © 2026 Paviljoen Zuidlanden
      </div>
    </footer>
  );
};

export default FooterSection;
