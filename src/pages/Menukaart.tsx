import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import heroFries from "@/assets/hero-fries.jpg";
import bitterballen from "@/assets/bitterballen.jpg";
import frisdranken from "@/assets/frisdranken.jpg";
import barImage from "@/assets/bar.jpg";

const categories = [
  { img: heroFries, label: "VERS FRIET.", id: "friet" },
  { img: bitterballen, label: "SNACKS.", id: "snacks" },
  { img: frisdranken, label: "DRANKEN.", id: "dranken" },
  { img: barImage, label: "BORREL.", id: "borrel" },
];

const menuItems = [
  {
    category: "Friet",
    id: "friet",
    items: [
      { name: "Verse friet (klein)", price: "3,50" },
      { name: "Verse friet (groot)", price: "5,00" },
      { name: "Friet speciaal", price: "6,00" },
      { name: "Patatje oorlog", price: "5,50" },
      { name: "Patatje joppie", price: "5,50" },
      { name: "Patatje satay", price: "6,00" },
      { name: "Kapsalon", price: "9,50" },
      { name: "Loaded fries", price: "8,50" },
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
      { name: "Mexicano", price: "2,75" },
      { name: "Loempia", price: "3,00" },
      { name: "Berenhap", price: "3,00" },
      { name: "Bamischijf", price: "2,75" },
      { name: "Viandel", price: "2,50" },
    ],
  },
  {
    category: "Dranken",
    id: "dranken",
    items: [
      { name: "Frisdrank", price: "2,50" },
      { name: "Koffie", price: "2,25" },
      { name: "Thee", price: "2,25" },
      { name: "Cappuccino", price: "3,00" },
      { name: "Latte macchiato", price: "3,25" },
      { name: "Warme chocolademelk", price: "3,00" },
      { name: "Vers sinaasappelsap", price: "3,50" },
    ],
  },
  {
    category: "Borrel",
    id: "borrel",
    items: [
      { name: "Bier (tap)", price: "3,00" },
      { name: "Speciaalbier", price: "4,50" },
      { name: "Wijn (wit/rood/rosé)", price: "3,50" },
      { name: "Prosecco", price: "4,00" },
      { name: "Aperol Spritz", price: "6,50" },
      { name: "Hugo Spritz", price: "6,50" },
      { name: "Borrelplank", price: "12,50" },
    ],
  },
];

const Menukaart = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-body text-xs font-semibold tracking-[0.4em] uppercase">
              Volledige menukaart
            </span>
            <h1 className="text-5xl md:text-8xl font-extrabold text-foreground mt-4 font-display tracking-tight">
              Menukaart<span className="text-primary">.</span>
            </h1>
          </motion.div>

          {/* Category image cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {categories.map((cat, i) => (
              <motion.a
                key={cat.label}
                href={`#${cat.id}`}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-muted"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
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

          {/* Full menu */}
          <div className="grid md:grid-cols-2 gap-10">
            {menuItems.map((cat, i) => (
              <motion.div
                key={cat.category}
                id={cat.id}
                className="bg-card rounded-3xl p-8 border border-border hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h2 className="text-2xl font-extrabold text-foreground mb-8 font-display tracking-tight">
                  {cat.category}<span className="text-primary">.</span>
                </h2>
                <ul className="space-y-5">
                  {cat.items.map((item) => (
                    <li key={item.name} className="flex justify-between items-baseline font-body text-foreground">
                      <span className="text-sm">{item.name}</span>
                      <span className="flex-1 border-b border-dotted border-border mx-3 mb-1" />
                      <span className="text-sm font-semibold text-primary ml-4">€{item.price}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Menukaart;
