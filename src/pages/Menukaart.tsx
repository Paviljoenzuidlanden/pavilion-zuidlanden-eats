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
  { img: heroFries, label: "FRIET.", id: "friet" },
  { img: bitterballen, label: "SNACKS.", id: "snacks" },
  { img: frisdranken, label: "BROODJES.", id: "broodjes" },
  { img: barImage, label: "EXTRA.", id: "extra" },
];

const menuItems = [
  {
    category: "Friet",
    id: "friet",
    items: [
      { name: "Verse friet", price: "2,75" },
      { name: "Grote verse friet", price: "3,75" },
      { name: "Verse rustiek friet", price: "3,25" },
      { name: "Grote verse rustieke friet", price: "" },
      { name: "Familiezak verse friet voor 2 personen", price: "5,35" },
      { name: "Familiezak verse friet voor 3 personen", price: "8,25" },
      { name: "Familiezak verse friet voor 4 personen", price: "11,25" },
      { name: "Familiezak verse friet voor 5 personen", price: "13,75" },
      { name: "Familiezak verse friet voor 6 personen", price: "16,25" },
      { name: "Familiezak rustieke friet voor 2 personen", price: "6,25" },
      { name: "Familiezak rustieke friet voor 3 personen", price: "9,50" },
      { name: "Familiezak rustieke friet voor 4 personen", price: "13,00" },
      { name: "Familiezak rustieke friet voor 5 personen", price: "" },
      { name: "Familiezak rustieke friet voor 6 personen", price: "" },
    ],
  },
  {
    category: "Snacks",
    id: "snacks",
    items: [
      { name: "Frikandel", price: "2,75" },
      { name: "Pikanto", price: "" },
      { name: "Kroket", price: "2,75" },
      { name: "Kalfsvleeskroket", price: "3,25" },
      { name: "Bamischijf", price: "3,00" },
      { name: "Nasischijf", price: "3,00" },
      { name: "Kaassoufflé", price: "2,75" },
      { name: "Bitterballen 8 stuks", price: "4,55" },
      { name: "Kipcorn", price: "3,15" },
      { name: "Hamburger", price: "3,95" },
      { name: "Kipburger", price: "2,95" },
      { name: "Kipnuggets", price: "5,00" },
      { name: "Kipnuggets 6 stuks", price: "4,15" },
      { name: "Kipnuggets 9 stuks", price: "6,15" },
    ],
  },
  {
    category: "Broodjes",
    id: "broodjes",
    items: [
      { name: "Broodje hamburger", price: "4,35" },
      { name: "Broodje hamburger speciaal", price: "5,25" },
      { name: "Broodje cheeseburger", price: "6,25" },
      { name: "Broodje frikandel", price: "3,25" },
      { name: "Broodje kroket", price: "3,35" },
      { name: "Broodje kipburger", price: "5,55" },
      { name: "Broodje bamischijf", price: "3,45" },
      { name: "Broodje kaassoufflé", price: "3,85" },
      { name: "Wit bolletje", price: "0,80" },
    ],
  },
  {
    category: "Bittergarnituur",
    id: "extra",
    items: [
      { name: "Bittergarnituur voor 2 personen", price: "11,95" },
      { name: "Bittergarnituur voor 4 personen", price: "20,45" },
      { name: "Bittergarnituur voor 6 personen", price: "28,95" },
      { name: "Bittergarnituur voor 8 personen", price: "37,95" },
      { name: "Bittergarnituur voor 10 personen", price: "45,95" },
    ],
  },
  {
    category: "Sauzen",
    id: "sauzen",
    items: [
      { name: "Mayonaise", price: "0,65" },
      { name: "Ketchup", price: "0,65" },
      { name: "Curry", price: "0,65" },
      { name: "Pindasaus", price: "0,90" },
      { name: "Speciaal", price: "0,80" },
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
                      <span className="text-sm font-semibold text-primary ml-4">{item.price ? `€ ${item.price}` : ""}</span>
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
