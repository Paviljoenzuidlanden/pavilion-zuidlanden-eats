import { motion } from "framer-motion";

const menuItems = [
  { category: "Friet", items: [
    { name: "Verse friet (klein)", price: "3,50" },
    { name: "Verse friet (groot)", price: "5,00" },
    { name: "Friet speciaal", price: "6,00" },
    { name: "Patatje oorlog", price: "5,50" },
    { name: "Kapsalon", price: "9,50" },
  ]},
  { category: "Snacks", items: [
    { name: "Frikandel", price: "2,50" },
    { name: "Kroket", price: "2,50" },
    { name: "Kaassoufflé", price: "2,75" },
    { name: "Bitterballen (6 st)", price: "5,50" },
    { name: "Kipcorn", price: "2,75" },
  ]},
  { category: "Dranken", items: [
    { name: "Frisdrank", price: "2,50" },
    { name: "Koffie", price: "2,25" },
    { name: "Thee", price: "2,25" },
    { name: "Bier (tap)", price: "3,00" },
  ]},
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const MenuSection = () => {
  return (
    <section id="menu" className="py-20 px-4 bg-card">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center text-foreground mb-2 font-display"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ons Menu
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-12 font-body text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Vers bereid, eerlijk geprijsd
        </motion.p>
        <motion.div
          className="grid md:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {menuItems.map((cat) => (
            <motion.div key={cat.category} variants={cardVariants}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-display border-b-2 border-primary pb-2">
                {cat.category}
              </h3>
              <ul className="space-y-3">
                {cat.items.map((item) => (
                  <li key={item.name} className="flex justify-between font-body text-foreground">
                    <span>{item.name}</span>
                    <span className="font-medium text-muted-foreground">€{item.price}</span>
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
