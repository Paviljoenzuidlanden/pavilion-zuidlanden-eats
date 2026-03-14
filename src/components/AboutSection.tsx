import { motion } from "framer-motion";
import buitenkantImage from "@/assets/buitenkant.jpg";
import interiorImage from "@/assets/interior.jpg";

const AboutSection = () => {
  return (
    <section id="over-ons" className="py-16 md:py-32 px-4 md:px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-body text-xs font-semibold tracking-[0.4em] uppercase">Over ons</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-foreground mt-4 mb-8 font-display tracking-tight leading-[0.95]">
              Meer dan<br />een snackbar<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 font-body">
              Paviljoen Zuidlanden is dé ontmoetingsplek van Leeuwarden-Zuid. Gelegen midden in de nieuwe wijk De Zuidlanden, omringd door natuur en ruimte.
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 font-body">
              Kom langs voor een verse portie friet, rustieke friet met schil, een gezellige borrel met vrienden, of vier je feest in onze sfeervolle ruimte. Bij ons draait alles om verbinding en genieten.
            </p>
            <div className="flex gap-6 sm:gap-12 flex-wrap">
              {[
                { value: "Vers", label: "Dagelijks vers" },
                { value: "80+", label: "Gasten bij feesten" },
                { value: "7/7", label: "Dagen sfeer" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-4xl font-extrabold font-display text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-body mt-1 tracking-wide uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={buitenkantImage}
                alt="Paviljoen Zuidlanden van buiten"
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating accent card */}
            <motion.div
              className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-primary text-primary-foreground p-4 md:p-6 rounded-2xl shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-3xl font-extrabold font-display">PZ</div>
              <div className="text-xs tracking-widest uppercase opacity-80">Zuidlanden</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
