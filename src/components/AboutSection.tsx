import { motion } from "framer-motion";
import buitenkantImage from "@/assets/buitenkant.jpg";

const AboutSection = () => {
  return (
    <section id="over-ons" className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-body text-sm font-semibold tracking-[0.3em] uppercase">Over ons</span>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mt-3 font-display tracking-tight">
            Meer dan een snackbar.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-muted-foreground text-lg leading-relaxed mb-6 font-body">
              Paviljoen Zuidlanden is dé ontmoetingsplek van Leeuwarden-Zuid. Gelegen midden in de nieuwe wijk De Zuidlanden, omringd door natuur en ruimte.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-body">
              Kom langs voor een verse portie friet met velletje, een gezellige borrel met vrienden, of vier je feest in onze sfeervolle ruimte. Bij ons draait alles om verbinding en genieten.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "Vers", label: "Dagelijks verse friet" },
                { value: "80+", label: "Gasten bij feesten" },
                { value: "7/7", label: "Dagen per week sfeer" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold font-display text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-body mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <img
              src={buitenkantImage}
              alt="Paviljoen Zuidlanden van buiten"
              className="w-full h-96 object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
