import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wine } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import heroFries from "@/assets/hero-fries.jpg";
import verseFries from "@/assets/verse-friet.jpg";
import bitterballen from "@/assets/bitterballen.jpg";
import broodjesImage from "@/assets/broodjes.jpg";
import frisdranken from "@/assets/frisdranken.jpg";
import sauzenImage from "@/assets/sauzen.jpg";

const categories = [
  { img: verseFries, label: "VERSE FRIET.", id: "friet" },
  { img: heroFries, label: "RUSTIEKE FRIET.", id: "rustiek" },
  { img: bitterballen, label: "SNACKS.", id: "snacks" },
  { img: broodjesImage, label: "BROODJES.", id: "broodjes" },
  { img: frisdranken, label: "DRANKEN.", id: "dranken" },
  { img: sauzenImage, label: "SAUZEN.", id: "sauzen" },
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
      { name: "Verse rustieke friet met schil", price: "3,25" },
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
      { name: "Mexicano", price: "3,35" },
      { name: "Kroket", price: "2,60" },
      { name: "Kalfsvleeskroket", price: "2,80" },
      { name: "Vegetarische kroket", price: "2,95" },
      { name: "Bamischijf", price: "2,90" },
      { name: "Nasischijf", price: "2,90" },
      { name: "Kaassoufflé", price: "3,00" },
      { name: "Kipcorn", price: "2,95" },
      { name: "Gehaktbal (van de Huzumer slager)", price: "4,00" },
      { name: "Hamburger", price: "3,80" },
      { name: "Bitterballen 4 stuks", price: "3,50" },
      { name: "Kipnuggets 6 stuks", price: "4,15" },
      { name: "Kipnuggets 9 stuks", price: "6,15" },
      { name: "Kaasstengels 6 stuks", price: "4,75" },
      { name: "Borrelbox (12 hapjes)", price: "8,50" },
    ],
  },
  {
    category: "Broodjes",
    id: "broodjes",
    items: [
      { name: "Broodje Frikandel", price: "3,15" },
      { name: "Broodje Pikanto", price: "4,00" },
      { name: "Broodje Kroket", price: "3,25" },
      { name: "Broodje Kalfsvleeskroket", price: "3,45" },
      { name: "Broodje Vegetarische kroket", price: "3,60" },
      { name: "Broodje Bamischijf", price: "3,55" },
      { name: "Broodje Nasischijf", price: "3,55" },
      { name: "Broodje Kaassoufflé", price: "3,65" },
      { name: "Broodje Kipcorn", price: "3,60" },
      { name: "Broodje Gehaktbal (van de Huzumer slager)", price: "4,65" },
      { name: "Broodje Hamburger", price: "4,45" },
      { name: "Broodje Kipburger", price: "4,60" },
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
      { name: "Joppiesaus", price: "0,90" },
      { name: "Speciaal", price: "0,80" },
      { name: "Speciaal zonder ui", price: "0,80" },
      { name: "Oorlog", price: "0,90" },
    ],
  },
];

const drinksList = (title: string, items: { name: string; price: string }[], key: string) => (
  <div key={key}>
    <h3 className="text-lg font-extrabold text-foreground mb-4 font-display tracking-tight">
      {title}<span className="text-primary">.</span>
    </h3>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.name} className="flex items-baseline font-body text-foreground">
          <span className="text-sm flex-shrink-0 max-w-[calc(100%-90px)]">{item.name}</span>
          <span className="flex-1 border-b border-dotted border-border mx-2 sm:mx-3 mb-1 min-w-[12px]" />
          <span className="text-sm font-semibold text-primary flex-shrink-0 w-[60px] sm:w-[70px] text-right whitespace-nowrap">€ {item.price}</span>
        </li>
      ))}
    </ul>
  </div>
);

const wineBlocks = [
  {
    name: "Duc d'Émbret",
    origin: "Pays d'Oc IGP · Languedoc-Roussillon, Frankrijk",
    wines: [
      {
        color: "Rode wijn",
        glass: "5,25",
        bottle: "21,00",
        grapes: "Syrah, Grenache, Carignan",
        desc: "Fruitig en soepel met aroma's van rood fruit en een intense granaatrode kleur. Zacht en levendig in de mond, mooi in balans.",
      },
      {
        color: "Witte wijn",
        glass: "5,25",
        bottle: "21,00",
        grapes: "Vermentino, Grenache Blanc",
        desc: "Fris en elegant met aroma's van tropisch fruit en bloemige tonen. In de mond tonen van rijpe peer en citrus, met een verfrissende zuurgraad en een heldere afdronk.",
      },
      {
        color: "Rosé wijn",
        glass: "5,25",
        bottle: "21,00",
        grapes: "Cinsault, Grenache",
        desc: "Zacht en fruitig met frisse tonen van framboos en een subtiele bloemigheid. Een heerlijke, toegankelijke rosé en perfect als aperitief.",
      },
    ],
  },
  {
    name: "Bodegas Cerrosol – Verdejo",
    origin: "Rueda DO · Castilla y León, Spanje",
    wines: [
      {
        color: "Witte wijn",
        glass: "6,00",
        bottle: "24,95",
        grapes: "Verdejo",
        desc: "Fris en sappig met tonen van witte bloemen, venkel en citrus. Rond en elegant met een aangename afdronk.",
      },
    ],
  },
  {
    name: "Mario del Conte – Appassimento",
    origin: "Puglia IGT · Zuid-Italië",
    wines: [
      {
        color: "Rode wijn",
        glass: "6,00",
        bottle: "24,95",
        grapes: "",
        desc: "Vol en krachtig met tonen van gedroogd zwart fruit, chocolade, specerijen en rozijnen. Rijk en kruidig met een lange, intense afdronk. Heerlijk bij gegrild vlees en stevige gerechten.",
      },
    ],
  },
];

const BottleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
    aria-hidden="true"
  >
    <path d="M10 2h4" />
    <path d="M10.5 2.5v3.6a4 4 0 0 0-2 3.4V19a2.5 2.5 0 0 0 2.5 2.5h2A2.5 2.5 0 0 0 15.5 19V9.5a4 4 0 0 0-2-3.4V2.5" />
  </svg>
);

interface LocationState {
  scrollToId?: string;
}

const Menukaart = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.scrollToId) {
      const el = document.getElementById(state.scrollToId);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
      }
    }
  }, [location]);

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
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(cat.id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] w-[140px] sm:w-[180px] bg-muted cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
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

          {/* Eten & snacks */}
          <div className="grid md:grid-cols-2 gap-10">
            {menuItems.map((cat, i) => (
              <motion.div
                key={cat.category}
                id={cat.id}
                className="bg-card rounded-3xl p-5 sm:p-8 border border-border hover:shadow-xl transition-shadow duration-300 scroll-mt-28"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <h2 className="text-2xl font-extrabold text-foreground mb-6 font-display tracking-tight">
                  {cat.category}<span className="text-primary">.</span>
                </h2>
                <ul className="space-y-4">
                  {cat.items.map((item) => (
                    <li key={item.name} className="flex items-baseline font-body text-foreground">
                      <span className="text-sm flex-shrink-0 max-w-[calc(100%-90px)]">{item.name}</span>
                      <span className="flex-1 border-b border-dotted border-border mx-2 sm:mx-3 mb-1 min-w-[12px]" />
                      <span className="text-sm font-semibold text-primary flex-shrink-0 w-[60px] sm:w-[70px] text-right whitespace-nowrap">€ {item.price}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Dranken */}
          <motion.div
            id="dranken"
            className="bg-card rounded-3xl p-5 sm:p-8 border border-border hover:shadow-xl transition-shadow duration-300 scroll-mt-28 mt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-extrabold text-foreground mb-8 font-display tracking-tight">
              Dranken<span className="text-primary">.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {drinksList(
                "Frisdranken",
                [
                  { name: "Coca Cola", price: "2,75" },
                  { name: "Coca Cola Zero", price: "2,75" },
                  { name: "Fanta", price: "2,75" },
                  { name: "Sprite", price: "2,75" },
                  { name: "Fuze Tea sparkling", price: "2,75" },
                  { name: "Fuze Tea Green", price: "2,75" },
                  { name: "Rivella", price: "2,75" },
                  { name: "Appelsap", price: "3,00" },
                  { name: "Fristi", price: "3,00" },
                  { name: "Chocomelk", price: "3,00" },
                  { name: "Chaudfontaine Plat", price: "2,50" },
                  { name: "Chaudfontaine Bruisend", price: "2,50" },
                  { name: "Ranja", price: "1,50" },
                  { name: "Royal Bliss Bitter Lemon", price: "3,00" },
                  { name: "Royal Bliss Tonic", price: "3,00" },
                  { name: "Royal Bliss Ginger Ale", price: "3,00" },
                  { name: "Royal Bliss Ginger Beer", price: "3,00" },
                ],
                "frisdranken"
              )}
              {drinksList(
                "Koffie & Thee",
                [
                  { name: "Koffie", price: "2,50" },
                  { name: "Thee", price: "2,50" },
                  { name: "Espresso", price: "2,50" },
                  { name: "Cappuccino", price: "3,00" },
                  { name: "Latte macchiato", price: "3,00" },
                  { name: "Dubbele espresso", price: "4,00" },
                  { name: "Warme chocolademelk", price: "3,00" },
                ],
                "koffie-thee"
              )}
              {drinksList(
                "Bier van de tap",
                [
                  { name: "Hertog Jan pils 0,25", price: "3,25" },
                  { name: "Hertog Jan pils 0,5", price: "6,00" },
                  { name: "Hertog Jan Weizener 0,3", price: "4,25" },
                  { name: "Hertog Jan Weizener 0,5", price: "7,00" },
                  { name: "Wisseltap 0,3", price: "4,25" },
                ],
                "bier-tap"
              )}
              {drinksList(
                "Bier op fles",
                [
                  { name: "Corona", price: "4,25" },
                  { name: "Radler", price: "4,25" },
                  { name: "Hoegaarden wit", price: "4,25" },
                  { name: "Tripel Karmeliet", price: "5,25" },
                  { name: "Hertog Jan Lente Bock (seizoen)", price: "4,25" },
                  { name: "Hertog Jan Bock (seizoen)", price: "4,25" },
                ],
                "bier-fles"
              )}
              {drinksList(
                "Alcoholvrij",
                [
                  { name: "Hertog Jan 0,0", price: "3,25" },
                  { name: "Corona 0,0", price: "4,00" },
                  { name: "Leffe 0,0", price: "4,00" },
                  { name: "Radler 0,0", price: "4,00" },
                ],
                "alcoholvrij"
              )}
            </div>

            {/* Wijnen */}
            <div className="mt-12">
              <h3 className="text-lg font-extrabold text-foreground mb-6 font-display tracking-tight">
                Wijnen<span className="text-primary">.</span>
              </h3>
              <div>
                {wineBlocks.map((block, bi) => (
                  <div
                    key={block.name}
                    className={bi > 0 ? "border-t border-primary/40 py-6" : "pb-2"}
                  >
                    <h4 className="font-display font-bold text-foreground text-base tracking-tight">
                      {block.name}
                    </h4>
                    <p className="italic text-muted-foreground text-xs font-body mt-0.5">
                      {block.origin}
                    </p>
                    {block.wines.map((w) => (
                      <div key={w.color} className="mt-4">
                        <div className="flex items-baseline justify-between gap-3 flex-wrap">
                          <span className="font-body text-sm font-semibold text-foreground">
                            {w.color}
                          </span>
                          <span className="flex items-center gap-4 sm:gap-6 text-sm whitespace-nowrap">
                            <span className="flex items-center gap-1.5 text-primary font-semibold font-body">
                              <Wine className="w-4 h-4" />
                              € {w.glass}
                            </span>
                            <span className="flex items-center gap-1.5 text-primary font-semibold font-body">
                              <BottleIcon />
                              € {w.bottle}
                            </span>
                          </span>
                        </div>
                        <p className="italic text-muted-foreground text-xs font-body mt-1.5 leading-relaxed">
                          {w.desc}
                        </p>
                        {w.grapes && (
                          <p className="text-muted-foreground text-[11px] font-body mt-1">
                            Druiven: {w.grapes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Menukaart;
