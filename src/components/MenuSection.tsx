import { motion } from "framer-motion";

const menuItems = [
  {
    category: "Friet",
    items: [
      { name: "Verse friet (klein)", price: "3,50" },
      { name: "Verse friet (groot)", price: "5,00" },
      { name: "Friet speciaal", price: "6,00" },
      { name: "Patatje oorlog", price: "5,50" },
      { name: "Kapsalon", price: "9,50" },
    ],
  },
  {
    category: "Snacks",
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
    items: [
      { name: "Frisdrank", price: "2,50" },
      { name: "Koffie", price: "2,25" },
      { name: "Thee", price: "2,25" },
      { name: "Bier (tap)", price: "3,00" },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const MenuSection = () => {
  return (
    <section id="menu" className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-body text-sm font-semibold tracking-[0.3em] uppercase">Menukaart</span>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mt-3 font-display tracking-tight">
            Vers bereid.
          </h2>
          <p className="text-muted-foreground font-body text-lg mt-4">
            Eerlijk geprijsd, ambachtelijk klaargemaakt
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {menuItems.map((cat) => (
            <motion.div
              key={cat.category}
              variants={cardVariants}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border"
            >
              <h3 className="text-2xl font-bold text-primary mb-6 font-display tracking-tight">
                {cat.category}
              </h3>
              <ul className="space-y-4">
                {cat.items.map((item) => (
                  <li key={item.name} className="flex justify-between font-body text-foreground">
                    <span>{item.name}</span>
                    <span className="font-semibold text-muted-foreground">€{item.price}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
