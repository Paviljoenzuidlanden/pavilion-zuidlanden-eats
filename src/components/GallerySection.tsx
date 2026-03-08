import { motion } from "framer-motion";
import barImage from "@/assets/bar.jpg";
import zaalImage from "@/assets/zaal.jpg";
import zaal2Image from "@/assets/zaal2.jpg";
import buitenkantImage from "@/assets/buitenkant.jpg";
import feestSfeer from "@/assets/feest-sfeer.jpg";

const photos = [
  { src: buitenkantImage, alt: "Paviljoen Zuidlanden van buiten", label: "Het paviljoen" },
  { src: zaalImage, alt: "De gezellige zaal", label: "De zaal" },
  { src: barImage, alt: "De bar", label: "De bar" },
  { src: zaal2Image, alt: "Sfeervolle ruimte", label: "Feestlocatie" },
  { src: feestSfeer, alt: "Feest sfeer", label: "Sfeer" },
];

const GallerySection = () => {
  return (
    <section id="gallerij" className="py-32 px-6 bg-muted">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-body text-xs font-semibold tracking-[0.4em] uppercase">Sfeer</span>
          <h2 className="text-5xl md:text-7xl font-extrabold text-foreground mt-4 font-display tracking-tight">
            Een kijkje<span className="text-primary">.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-6 grid-rows-2 gap-3 h-[600px]">
          {photos.map((photo, i) => {
            const spanClasses = [
              "col-span-3 row-span-2",   // big left
              "col-span-2 row-span-1",   // top middle
              "col-span-1 row-span-1",   // top right
              "col-span-1 row-span-1",   // bottom middle-left
              "col-span-2 row-span-1",   // bottom right
            ];
            return (
              <motion.div
                key={photo.label}
                className={`relative group overflow-hidden rounded-2xl ${spanClasses[i]}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                  <span className="text-secondary-foreground font-display text-sm font-bold tracking-wide uppercase">
                    {photo.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
