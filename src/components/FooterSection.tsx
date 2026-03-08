import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const FooterSection = () => {
  return (
    <footer id="contact" className="py-16 px-4 bg-secondary text-secondary-foreground">
      <motion.div
        className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center md:text-left"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h3 className="text-xl font-bold font-display mb-4 text-primary">Locatie</h3>
          <div className="flex items-start justify-center md:justify-start gap-2 text-secondary-foreground/80 font-body">
            <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
            <span>It Boumantsje<br />8941 CR Leeuwarden</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold font-display mb-4 text-primary">Openingstijden</h3>
          <div className="flex items-start justify-center md:justify-start gap-2 text-secondary-foreground/80 font-body">
            <Clock className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p>Donderdag: 16:00 – 21:00</p>
              <p>Vrijdag: 12:00 – 23:00</p>
              <p>Zaterdag: 14:00 – 23:00</p>
              <p>Zondag: 14:00 – 21:00</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold font-display mb-4 text-primary">Contact</h3>
          <div className="flex items-center justify-center md:justify-start gap-2 text-secondary-foreground/80 font-body mb-4">
            <Phone className="w-5 h-5 shrink-0" />
            <span>058 - 123 4567</span>
          </div>
          <a
            href="https://wijkpanelzuidlanden.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-body font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Wijkpanel de Zuidlanden
          </a>
        </div>
      </motion.div>
      <div className="text-center mt-12 text-secondary-foreground/50 font-body text-sm">
        © 2026 Paviljoen Zuidlanden · Est. 2026
      </div>
    </footer>
  );
};

export default FooterSection;
