import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroFries from "@/assets/hero-fries.jpg";
import bitterballen from "@/assets/bitterballen.jpg";
import frisdranken from "@/assets/frisdranken.jpg";
import barImage from "@/assets/bar.jpg";

const categories = [
  { img: heroFries, label: "VERS FRIET.", href: "#friet" },
  { img: bitterballen, label: "SNACKS.", href: "#snacks" },
  { img: frisdranken, label: "DRANKEN.", href: "#dranken" },
  { img: barImage, label: "BORREL.", href: "#borrel" },
];

const menuItems = [
  {
    category: "Friet",
    id: "friet",
    items: [
      { name: "Verse friet (klein)", price: "2,75" },
      { name: "Verse friet (groot)", price: "3,00" },
      { name: "Friet speciaal", price: "3,55" },
      { name: "Patatje oorlog", price: "5,50" },
      { name: "Kapsalon", price: "9,50" },
    ],
  },
  {
    category: "Snacks",
    id: "snacks",
    items: [
      { name: "Frikandel", price: "2,50" },
      { name: "Kroket", price: "2,50" },
      { name: "Kaassoufflé", price: "2,75" },
      { name: "Bitterballen (6 st)", price: "5,50" },
      { name: "Kipcorn", price: "2,75" },
    ],
  },
  {
    category: "Dranken",
    id: "dranken",
    items: [
      { name: "Frisdrank vanaf", price: "3,00" },
      { name: "Bier vanaf", price: "3,50" },
      { name: "Koffie/Thee vanaf", price: "3,00" },
    ],
  },
];

const MenuSection = () => {
  return (
    <section id="menu" className="bg-background">
      {/* Category cards like DoubleFF */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-body text-xs font-semibold tracking-[0.4em] uppercase">Menukaart</span>
            <h2 className="text-5xl md:text-8xl font-extrabold text-foreground mt-4 font-display tracking-tight">
              Damn tasty<span className="text-primary">.</span>
            </h2>
          </motion.div>

          {/* Category image cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {categories.map((cat, i) => (
              <motion.a
                key={cat.label}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-muted"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-primary font-display font-extrabold text-lg md:text-xl tracking-tight">
                  {cat.label}
                </span>
              </motion.a>
            ))}
          </div>

          {/* Preview - first 3 categories with limited items */}
          <div className="grid md:grid-cols-3 gap-10">
            {menuItems.map((cat, i) => (
              <motion.div
                key={cat.category}
                className="bg-card rounded-3xl p-8 border border-border hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h3 className="text-2xl font-extrabold text-foreground mb-8 font-display tracking-tight">
                  {cat.category}<span className="text-primary">.</span>
                </h3>
                <ul className="space-y-5">
                  {cat.items.slice(0, 3).map((item) => (
                    <li key={item.name} className="flex justify-between items-baseline font-body text-foreground">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-semibold text-primary ml-4">€{item.price}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground text-xs mt-4 font-body">en meer...</p>
              </motion.div>
            ))}
          </div>

          {/* CTA to full menu */}
          <motion.div
            className="text-center mt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to="/menukaart"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body font-semibold text-sm tracking-wider uppercase hover:scale-105 transition-transform"
            >
              Bekijk volledige menukaart
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scrolling marquee strip */}
      <div className="py-5 bg-primary overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {Array(4).fill(["VERS FRIET", "·", "BITTERBALLEN", "·", "BORREL", "·", "GEZELLIGHEID", "·", "FEEST", "·"]).flat().map((item, i) => (
            <span key={i} className="text-primary-foreground font-display text-sm font-bold tracking-[0.3em] uppercase">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
