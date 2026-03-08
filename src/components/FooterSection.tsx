import { MapPin, Clock, Phone } from "lucide-react";

const FooterSection = () => {
  return (
    <footer id="contact" className="py-16 px-4 bg-secondary text-secondary-foreground">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold font-display mb-4 text-primary">Locatie</h3>
          <div className="flex items-start justify-center md:justify-start gap-2 text-secondary-foreground/80 font-body">
            <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
            <span>Zuidlanden<br />Leeuwarden</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold font-display mb-4 text-primary">Openingstijden</h3>
          <div className="flex items-start justify-center md:justify-start gap-2 text-secondary-foreground/80 font-body">
            <Clock className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p>Ma t/m vr: 11:00 – 21:00</p>
              <p>Za – zo: 12:00 – 21:00</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold font-display mb-4 text-primary">Contact</h3>
          <div className="flex items-center justify-center md:justify-start gap-2 text-secondary-foreground/80 font-body">
            <Phone className="w-5 h-5 shrink-0" />
            <span>058 - 123 4567</span>
          </div>
        </div>
      </div>
      <div className="text-center mt-12 text-secondary-foreground/50 font-body text-sm">
        © 2026 Paviljoen Zuidlanden · Est. 2026
      </div>
    </footer>
  );
};

export default FooterSection;
