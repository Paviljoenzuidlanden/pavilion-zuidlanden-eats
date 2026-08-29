import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import heroFries from "@/assets/hero-fries.jpg";
import verseFries from "@/assets/verse-friet.jpg";
import bitterballen from "@/assets/bitterballen.jpg";
import frisdranken from "@/assets/frisdranken.jpg";
import barImage from "@/assets/bar.jpg";
import sauzenImage from "@/assets/sauzen.jpg";
import interiorImage from "@/assets/interior.jpg";

const categories = [
  { img: verseFries, label: "VERSE FRIET.", id: "friet" },
  { img: heroFries, label: "RUSTIEKE FRIET.", id: "rustiek" },
  { img: bitterballen, label: "SNACKS.", id: "snacks" },
  { img: frisdranken, label: "BROODJES.", id: "broodjes" },
  { img: sauzenImage, label: "EXTRA.", id: "extra" },
];

const menuItems = [
  {
    category: "Verse Friet",
    id: "friet",
    items: [
      { name: "Verse friet", price: "2,75" },
      { name: "Grote verse friet", price: "3,75" },
      { name: "Familiezak verse friet (2 pers.)", price: "4,95" },
      { name: "Familiezak verse friet (3 pers.)", price: "7,95" },
      { name: "Familiezak verse friet (4 pers.)", price: "10,50" },
      { name: "Familiezak verse friet (5 pers.)", price: "12,50" },
      { name: "Familiezak verse friet (6 pers.)", price: "14,50" },
    ],
  },
  {
    category: "Rustieke Friet",
    id: "rustiek",
    items: [
      { name: "Verse rustiek friet met schil", price: "3,25" },
      { name: "Grote verse rustieke friet met schil", price: "4,25" },
      { name: "Familiezak rustieke friet met schil (2 pers.)", price: "5,95" },
      { name: "Familiezak rustieke friet met schil (3 pers.)", price: "9,25" },
      { name: "Familiezak rustieke friet met schil (4 pers.)", price: "12,25" },
      { name: "Familiezak rustieke friet met schil (5 pers.)", price: "14,25" },
      { name: "Familiezak rustieke friet met schil (6 pers.)", price: "16,25" },
    ],
  },
  {
    category: "Snacks",
    id: "snacks",
    items: [
      { name: "Frikandel", price: "2,50" },
      { name: "Pikanto", price: "3,35" },
      { name: "Kroket", price: "2,60" },
      { name: "Kalfsvleeskroket", price: "2,80" },
      { name: "Groente kroket / vega kroket", price: "2,95" },
      { name: "Bamischijf", price: "2,90" },
      { name: "Nasischijf", price: "2,90" },
      { name: "Kaassoufflé", price: "3,00" },
      { name: "Kipcorn", price: "2,95" },
      { name: "Gehaltbal", price: "4,00" },
      { name: "Eierbal", price: "3,60" },
      { name: "Hamburger", price: "3,95" },
      { name: "Kipburger", price: "4,00" },
      { name: "Vega burger", price: "4,00" },
      { name: "Bitterballen 6 stuks", price: "3,50" },
      { name: "Vega bitterballen 6 stuks", price: "3,50" },
      { name: "Kipnuggets 6 stuks", price: "4,15" },
      { name: "Kipnuggets 9 stuks", price: "6,15" },
      { name: "Mini loempia's 6 stuks", price: "4,75" },
      { name: "Vlammetjes 6 stuks", price: "4,75" },
      { name: "Kaasstengels 6 stuks", price: "4,75" },
    ],
  },

  {
    category: "Broodjes",
    id: "broodjes",
    items: [
      { name: "Broodje hamburger", price: "4,45" },
      { name: "Broodje hamburger speciaal", price: "5,25" },
      { name: "Broodje cheeseburger", price: "6,25" },
      { name: "Broodje frikandel", price: "3,00" },
      { name: "Broodje kroket", price: "3,10" },
      { name: "Broodje kipburger", price: "4,50" },
      { name: "Broodje bamischijf", price: "3,40" },
      { name: "Broodje kaassoufflé", price: "3,50" },
      { name: "Wit bolletje", price: "0,80" },
    ],
  },
  {
    category: "Bittergarnituur",
    id: "extra",
    items: [
      { name: "Bitterballen 8 stuks", price: "9,50" },
      { name: "Bruine Fruitschaal (bittergarnituur)", price: "9,50" },
      { name: "Borrelplank 2 personen", price: "14,95" },
      { name: "Borrelplank 3 personen", price: "21,95" },
      { name: "Borrelplank 4 personen", price: "27,95" },
      { name: "Borrelplank 5 personen", price: "34,95" },
      { name: "Frisse plank (komkommer, tomaat, wortel)", price: "4,50" },
    ],
  },
  {
    category: "Sauzen",
    id: "sauzen",
    items: [
      { name: "Mayonaise", price: "0,65" },
      { name: "Ketchup", price: "0,65" },
      { name: "Curry", price: "0,65" },
      { name: "Chilisaus", price: "0,65" },
      { name: "Pindasaus", price: "0,90" },
      { name: "Speciaal", price: "0,80" },
      { name: "Speciaal zonder ui", price: "0,80" },
      { name: "Oorlog", price: "0,90" },
      { name: "Beker Mayonaise (klein)", price: "1,50" },
      { name: "Beker Mayonaise (groot)", price: "2,50" },
      { name: "Beker Ketchup (klein)", price: "1,50" },
      { name: "Beker Ketchup (groot)", price: "2,50" },
      { name: "Beker Curry (klein)", price: "1,50" },
      { name: "Beker Curry (groot)", price: "2,50" },
      { name: "Beker Pindasaus", price: "2,50" },
    ],
  },
];

const Menukaart = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6">
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
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16">
            {categories.map((cat, i) => (
              <motion.a
                key={cat.label}
                href={`#${cat.id}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] w-[140px] sm:w-[180px] bg-muted"
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
                <span className="absolute bottom-3 left-3 right-3 text-primary font-display font-extrabold text-xs sm:text-sm tracking-tight leading-tight">
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
                className="bg-card rounded-3xl p-5 sm:p-8 border border-border hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h2 className="text-2xl font-extrabold text-foreground mb-6 font-display tracking-tight">
                  {cat.category}<span className="text-primary">.</span>
                </h2>
                <ul className="space-y-5">
                  {cat.items.map((item) => (
                    <li key={item.name} className="flex items-baseline font-body text-foreground">
                      <span className="text-sm flex-shrink-0 max-w-[calc(100%-90px)]">{item.name}</span>
                      <span className="flex-1 border-b border-dotted border-border mx-2 sm:mx-3 mb-1 min-w-[12px]" />
                      <span className="text-sm font-semibold text-primary flex-shrink-0 w-[60px] sm:w-[70px] text-right whitespace-nowrap">{item.price ? `€ ${item.price}` : ""}</span>
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
