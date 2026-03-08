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

const MenuSection = () => {
  return (
    <section id="menu" className="py-20 px-4 bg-card">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-foreground mb-2 font-display">
          Ons Menu
        </h2>
        <p className="text-center text-muted-foreground mb-12 font-body text-lg">
          Vers bereid, eerlijk geprijsd
        </p>
        <div className="grid md:grid-cols-3 gap-10">
          {menuItems.map((cat) => (
            <div key={cat.category}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
