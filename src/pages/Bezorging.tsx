import { motion } from "framer-motion";
import { Truck, MapPin, Clock, Bell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const wijken = [
  { name: "Techum", description: "Inclusief Techum-Noord en Techum-Zuid" },
  { name: "De Klamp", description: "Heel De Klamp en omgeving" },
  { name: "Goutum", description: "Dorp Goutum en directe omgeving" },
  { name: "Wiarda", description: "Wiarda en aangrenzende gebieden" },
];

const Bezorging = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full font-body text-sm font-semibold tracking-wide uppercase mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Bell className="w-4 h-4" />
            Binnenkort beschikbaar
          </motion.div>
          <motion.h1
            className="text-5xl md:text-8xl font-bold font-display tracking-tight uppercase mt-2 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Bezorging
          </motion.h1>
          <motion.p
            className="text-background/60 font-body text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Binnenkort bezorgen wij onze verse friet en snacks bij jou thuis! 
            We starten met bezorging in de wijken rondom Paviljoen Zuidlanden.
          </motion.p>
        </div>
      </section>

      {/* Bezorggebied */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-body text-sm font-semibold tracking-[0.3em] uppercase">Bezorggebied</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 font-display tracking-tight">
              We komen naar jou toe.
            </h2>
            <p className="text-muted-foreground font-body text-lg mt-4 max-w-xl mx-auto">
              We starten met bezorging in de volgende wijken in Leeuwarden-Zuid
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {wijken.map((wijk, i) => (
              <motion.div
                key={wijk.name}
                className="bg-card rounded-2xl border border-border p-6 flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-foreground tracking-tight">{wijk.name}</h3>
                  <p className="text-sm text-muted-foreground font-body mt-1">{wijk.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hoe werkt het */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-body text-sm font-semibold tracking-[0.3em] uppercase">Hoe werkt het</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 font-display tracking-tight">
              Simpel & snel.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Bestel online", desc: "Kies je favoriete friet, snacks en dranken via onze website" },
              { step: "02", title: "Wij bereiden het vers", desc: "Alles wordt vers klaargemaakt zodra jouw bestelling binnenkomt" },
              { step: "03", title: "Bezorgd aan de deur", desc: "Binnen 30-45 minuten staat het warm en vers bij jou op de stoep" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <div className="text-5xl font-bold font-display text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold font-display text-foreground tracking-tight mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-body">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notify CTA */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Truck className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold font-display text-primary-foreground tracking-tight mb-4">
              Stay tuned!
            </h2>
            <p className="text-primary-foreground/70 font-body text-lg mb-8 max-w-xl mx-auto">
              Volg ons op Instagram om als eerste te weten wanneer we starten met bezorgen in jouw wijk.
            </p>
            <a
              href="https://instagram.com/paviljoen.zuidlanden"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-lg font-body font-semibold tracking-wide uppercase hover:brightness-95 transition-all"
            >
              Volg ons op Instagram
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-foreground text-center">
        <p className="text-background/30 font-body text-sm tracking-wide uppercase">
          © 2026 Paviljoen Zuidlanden
        </p>
      </footer>
    </div>
  );
};

export default Bezorging;
