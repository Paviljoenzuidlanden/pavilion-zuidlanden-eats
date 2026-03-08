import { motion } from "framer-motion";
import barImage from "@/assets/bar.jpg";
import zaalImage from "@/assets/zaal.jpg";
import zaal2Image from "@/assets/zaal2.jpg";
import buitenkantImage from "@/assets/buitenkant.jpg";

const photos = [
  { src: buitenkantImage, alt: "Paviljoen Zuidlanden van buiten", label: "Ons paviljoen" },
  { src: zaalImage, alt: "De gezellige zaal", label: "De zaal" },
  { src: zaal2Image, alt: "Sfeervolle ruimte", label: "Feestlocatie" },
  { src: barImage, alt: "De bar", label: "De bar" },
];

const GallerySection = () => {
  return (
    <section id="gallerij" className="py-24 px-4 bg-muted">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-body text-sm font-semibold tracking-[0.3em] uppercase">Sfeer</span>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mt-3 font-display tracking-tight">
            Een kijkje binnen.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.label}
              className={`relative group overflow-hidden rounded-2xl shadow-lg ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i === 0 ? "h-full min-h-[400px]" : "h-56 md:h-64"
                }`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                <span className="text-background font-display text-lg font-bold tracking-tight">
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
