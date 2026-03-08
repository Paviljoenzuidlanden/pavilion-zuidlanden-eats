import { motion } from "framer-motion";
import barImage from "@/assets/bar.jpg";
import zaalImage from "@/assets/zaal.jpg";
import zaal2Image from "@/assets/zaal2.jpg";
import buitenkantImage from "@/assets/buitenkant.jpg";

const photos = [
  { src: buitenkantImage, alt: "Paviljoen Zuidlanden van buiten", label: "Ons paviljoen" },
  { src: zaalImage, alt: "De gezellige zaal", label: "De zaal" },
  { src: zaal2Image, alt: "Sfeervolle ruimte met lichtslingers", label: "Feestlocatie" },
  { src: barImage, alt: "De bar met industriële lampen", label: "De bar" },
];

const GallerySection = () => {
  return (
    <section id="gallerij" className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center text-foreground mb-2 font-display"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Sfeerimpressie
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-12 font-body text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Een kijkje in ons paviljoen
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.label}
              className="relative group overflow-hidden rounded-sm shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-64 md:h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="text-primary-foreground font-display text-xl font-bold">
                  {photo.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
