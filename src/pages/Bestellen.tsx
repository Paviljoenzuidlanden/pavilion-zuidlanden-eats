import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingCart, Clock, Trash2, ChevronDown, ChevronUp, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Sauce = { name: string; price: number };

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  sauces: Sauce[];
};

const sauzen: Sauce[] = [
  { name: "Mayonaise", price: 0.65 },
  { name: "Ketchup", price: 0.65 },
  { name: "Curry", price: 0.65 },
  { name: "Pindasaus", price: 0.90 },
  { name: "Speciaal", price: 0.80 },
];

const categoriesWithSauces = ["Verse Friet", "Rustieke Friet", "Snacks", "Broodjes"];

const menuData = [
  {
    category: "Verse Friet",
    items: [
      { name: "Verse friet", price: 2.75 },
      { name: "Grote verse friet", price: 3.75 },
      { name: "Familiezak verse friet (2 pers.)", price: 5.35 },
      { name: "Familiezak verse friet (3 pers.)", price: 8.25 },
      { name: "Familiezak verse friet (4 pers.)", price: 11.25 },
    ],
  },
  {
    category: "Rustieke Friet",
    items: [
      { name: "Rustieke friet met schil", price: 3.25 },
      { name: "Grote rustieke friet met schil", price: 4.25 },
      { name: "Familiezak rustiek (2 pers.)", price: 6.25 },
      { name: "Familiezak rustiek (3 pers.)", price: 9.50 },
    ],
  },
  {
    category: "Snacks",
    items: [
      { name: "Frikandel", price: 2.75 },
      { name: "Pikanto", price: 3.25 },
      { name: "Kroket", price: 2.75 },
      { name: "Kalfsvleeskroket", price: 3.25 },
      { name: "Bamischijf", price: 3.00 },
      { name: "Nasischijf", price: 3.00 },
      { name: "Kaassoufflé", price: 2.75 },
      { name: "Bitterballen 8 stuks", price: 4.55 },
      { name: "Kipcorn", price: 3.15 },
      { name: "Hamburger", price: 3.95 },
      { name: "Kipburger", price: 2.95 },
      { name: "Kipnuggets 6 stuks", price: 4.15 },
      { name: "Kipnuggets 9 stuks", price: 6.15 },
    ],
  },
  {
    category: "Broodjes",
    items: [
      { name: "Broodje hamburger", price: 4.35 },
      { name: "Broodje hamburger speciaal", price: 5.25 },
      { name: "Broodje cheeseburger", price: 6.25 },
      { name: "Broodje frikandel", price: 3.25 },
      { name: "Broodje kroket", price: 3.35 },
      { name: "Broodje kipburger", price: 5.55 },
    ],
  },
];

const timeSlots = (() => {
  const slots: string[] = [];
  const pad = (n: number) => n.toString().padStart(2, "0");
  for (let mins = 16 * 60; mins < 20 * 60 + 30; mins += 15) {
    const end = mins + 15;
    slots.push(`${pad(Math.floor(mins / 60))}:${pad(mins % 60)} – ${pad(Math.floor(end / 60))}:${pad(end % 60)}`);
  }
  return slots;
})();

const formatPrice = (price: number) => price.toFixed(2).replace(".", ",");

const makeCartId = (name: string, sauces: Sauce[]) =>
  `${name}__${sauces.map((s) => s.name).sort().join(",")}`;

const itemTotal = (item: CartItem) => {
  const sauceTotal = item.sauces.reduce((s, sc) => s + sc.price, 0);
  return (item.price + sauceTotal) * item.quantity;
};

const Bestellen = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"menu" | "timeslot" | "details" | "overview">("menu");
  const [customerInfo, setCustomerInfo] = useState({ name: "", address: "", phone: "" });
  // Track pending sauce selections per item name
  const [pendingSauces, setPendingSauces] = useState<Record<string, Sauce[]>>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleSauce = (itemName: string, sauce: Sauce) => {
    setPendingSauces((prev) => {
      const current = prev[itemName] || [];
      const exists = current.find((s) => s.name === sauce.name);
      return {
        ...prev,
        [itemName]: exists
          ? current.filter((s) => s.name !== sauce.name)
          : [...current, sauce],
      };
    });
  };

  const addToCart = (item: { name: string; price: number }, category: string) => {
    const itemSauces = pendingSauces[item.name] || [];
    const id = makeCartId(item.name, itemSauces);

    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) {
        return prev.map((c) =>
          c.id === id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { id, ...item, quantity: 1, category, sauces: [...itemSauces] }];
    });

    // Reset sauces for this item after adding
    setPendingSauces((prev) => ({ ...prev, [item.name]: [] }));
    setExpandedItem(null);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.id === id ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.id !== id);
    });
  };

  const deleteFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + itemTotal(c), 0);

  const getQuantityForItem = (itemName: string) =>
    cart.filter((c) => c.name === itemName).reduce((sum, c) => sum + c.quantity, 0);

  const isDetailsValid = customerInfo.name.trim() !== "" && customerInfo.address.trim() !== "" && customerInfo.phone.trim() !== "";

  const handleOrder = () => {
    toast.success("Bestelling geplaatst!", {
      description: `Ophalen om ${selectedSlot}. Totaal: € ${formatPrice(totalPrice)}`,
    });
    setCart([]);
    setSelectedSlot(null);
    setCustomerInfo({ name: "", address: "", phone: "" });
    setStep("menu");
  };

  const hasSauceSupport = (category: string) => categoriesWithSauces.includes(category);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-body text-xs font-semibold tracking-[0.4em] uppercase">
              Online bestellen
            </span>
            <h1 className="text-5xl md:text-8xl font-extrabold text-foreground mt-4 font-display tracking-tight">
              Bestellen<span className="text-primary">.</span>
            </h1>
          </motion.div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[
              { key: "menu", label: "Producten" },
              { key: "timeslot", label: "Tijdvak" },
              { key: "details", label: "Gegevens" },
              { key: "overview", label: "Overzicht" },
            ].map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (s.key === "menu") setStep("menu");
                    if (s.key === "timeslot" && cart.length > 0) setStep("timeslot");
                    if (s.key === "details" && cart.length > 0 && selectedSlot) setStep("details");
                    if (s.key === "overview" && cart.length > 0 && selectedSlot && isDetailsValid) setStep("overview");
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-body font-semibold uppercase tracking-wider transition-all ${
                    step === s.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < 3 && <div className="w-4 sm:w-6 h-px bg-border" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Menu */}
            {step === "menu" && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  {menuData.map((cat) => (
                    <div
                      key={cat.category}
                      className="bg-card rounded-3xl p-5 sm:p-8 border border-border"
                    >
                      <h2 className="text-2xl font-extrabold text-foreground mb-6 font-display tracking-tight">
                        {cat.category}<span className="text-primary">.</span>
                      </h2>
                      <div className="space-y-1">
                        {cat.items.map((item) => {
                          const qty = getQuantityForItem(item.name);
                          const isExpanded = expandedItem === item.name;
                          const selectedSauces = pendingSauces[item.name] || [];
                          const showSauces = hasSauceSupport(cat.category);

                          return (
                            <div key={item.name}>
                              <div className="flex items-center justify-between gap-3 py-2">
                                <div className="flex-1 min-w-0">
                                  <span className="font-body text-sm text-foreground block truncate">
                                    {item.name}
                                  </span>
                                </div>
                                <span className="font-body text-sm font-semibold text-primary whitespace-nowrap">
                                  € {formatPrice(item.price)}
                                </span>
                                <div className="flex items-center gap-1">
                                  {qty > 0 && (
                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-body text-xs font-bold">
                                      {qty}
                                    </span>
                                  )}
                                  {showSauces ? (
                                    <button
                                      onClick={() =>
                                        setExpandedItem(isExpanded ? null : item.name)
                                      }
                                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground hover:scale-110 flex items-center justify-center transition-transform"
                                    >
                                      {isExpanded ? (
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      ) : (
                                        <Plus className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => addToCart(item, cat.category)}
                                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground hover:scale-110 flex items-center justify-center transition-transform"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Sauce picker */}
                              <AnimatePresence>
                                {isExpanded && showSauces && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pl-2 pb-3 pt-1">
                                      <p className="font-body text-xs text-muted-foreground mb-2">
                                        Kies je saus (optioneel):
                                      </p>
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        {sauzen.map((sauce) => {
                                          const isSelected = selectedSauces.some(
                                            (s) => s.name === sauce.name
                                          );
                                          return (
                                            <button
                                              key={sauce.name}
                                              onClick={() => toggleSauce(item.name, sauce)}
                                              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all border ${
                                                isSelected
                                                  ? "border-primary bg-primary/10 text-primary"
                                                  : "border-border bg-background text-foreground hover:border-primary/40"
                                              }`}
                                            >
                                              {sauce.name}
                                              <span className="ml-1 text-muted-foreground">
                                                +€{formatPrice(sauce.price)}
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                      <Button
                                        size="sm"
                                        onClick={() => addToCart(item, cat.category)}
                                        className="rounded-full bg-primary text-primary-foreground font-body text-xs px-5"
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Toevoegen
                                        {selectedSauces.length > 0 && (
                                          <span className="ml-1">
                                            (€{formatPrice(
                                              item.price +
                                                selectedSauces.reduce((s, sc) => s + sc.price, 0)
                                            )})
                                          </span>
                                        )}
                                      </Button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating cart bar */}
                <AnimatePresence>
                  {cart.length > 0 && (
                    <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-40"
                    >
                      <Button
                        onClick={() => setCartOpen(true)}
                        className="w-full sm:w-auto bg-primary text-primary-foreground rounded-full px-8 py-6 font-body font-bold text-sm shadow-2xl hover:scale-105 transition-transform flex items-center gap-3"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{totalItems} items</span>
                        <span className="w-px h-4 bg-primary-foreground/30" />
                        <span>€ {formatPrice(totalPrice)}</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* STEP 2: Time slot */}
            {step === "timeslot" && (
              <motion.div
                key="timeslot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card rounded-3xl p-5 sm:p-8 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-extrabold text-foreground font-display tracking-tight">
                      Kies een ophaaltijd<span className="text-primary">.</span>
                    </h2>
                  </div>
                  <p className="text-muted-foreground font-body text-sm mb-8">
                    Kies een tijdvak waarin je je bestelling wilt ophalen.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-4 rounded-2xl border-2 font-body font-semibold text-sm transition-all ${
                          selectedSlot === slot
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-foreground hover:border-primary/40"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-8 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("menu")}
                    className="rounded-full px-6 font-body"
                  >
                    ← Terug
                  </Button>
                  <Button
                    onClick={() => setStep("details")}
                    disabled={!selectedSlot}
                    className="rounded-full px-8 font-body bg-primary text-primary-foreground"
                  >
                    Verder →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Customer details */}
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card rounded-3xl p-5 sm:p-8 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-extrabold text-foreground font-display tracking-tight">
                      Jouw gegevens<span className="text-primary">.</span>
                    </h2>
                  </div>
                  <p className="text-muted-foreground font-body text-sm mb-8">
                    Vul je gegevens in zodat we je bestelling kunnen klaarmaken.
                  </p>

                  <div className="space-y-5 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-body text-sm font-semibold text-foreground">
                        Naam
                      </Label>
                      <Input
                        id="name"
                        placeholder="Je volledige naam"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                        className="rounded-xl font-body"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="font-body text-sm font-semibold text-foreground">
                        Adres
                      </Label>
                      <Input
                        id="address"
                        placeholder="Straat, huisnummer, postcode en plaats"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                        className="rounded-xl font-body"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-body text-sm font-semibold text-foreground">
                        Telefoonnummer
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="06 - 12345678"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        className="rounded-xl font-body"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("timeslot")}
                    className="rounded-full px-6 font-body"
                  >
                    ← Terug
                  </Button>
                  <Button
                    onClick={() => setStep("overview")}
                    disabled={!isDetailsValid}
                    className="rounded-full px-8 font-body bg-primary text-primary-foreground"
                  >
                    Verder →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Overview */}
            {step === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card rounded-3xl p-5 sm:p-8 border border-border mb-6">
                  <h2 className="text-2xl font-extrabold text-foreground mb-6 font-display tracking-tight">
                    Je bestelling<span className="text-primary">.</span>
                  </h2>

                  <div className="space-y-4 mb-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="font-body text-sm text-foreground block truncate">
                            {item.quantity}× {item.name}
                          </span>
                          {item.sauces.length > 0 && (
                            <span className="font-body text-xs text-accent block">
                              + {item.sauces.map((s) => s.name).join(", ")}
                            </span>
                          )}
                          <span className="font-body text-xs text-muted-foreground">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-7 h-7 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-body text-sm font-semibold text-primary whitespace-nowrap w-16 text-right">
                            € {formatPrice(itemTotal(item))}
                          </span>
                          <button
                            onClick={() => deleteFromCart(item.id)}
                            className="w-7 h-7 rounded-full hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors text-muted-foreground"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Ophaaltijd
                      </span>
                      <span className="font-semibold text-foreground">{selectedSlot}</span>
                    </div>
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <User className="w-4 h-4" /> Naam
                      </span>
                      <span className="font-semibold text-foreground">{customerInfo.name}</span>
                    </div>
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-muted-foreground">Adres</span>
                      <span className="font-semibold text-foreground">{customerInfo.address}</span>
                    </div>
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-muted-foreground">Telefoon</span>
                      <span className="font-semibold text-foreground">{customerInfo.phone}</span>
                    </div>
                    <div className="flex items-center justify-between font-body text-lg font-bold">
                      <span className="text-foreground">Totaal</span>
                      <span className="text-primary">€ {formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("details")}
                    className="rounded-full px-6 font-body"
                  >
                    ← Terug
                  </Button>
                  <Button
                    onClick={handleOrder}
                    className="rounded-full px-8 py-6 font-body font-bold bg-primary text-primary-foreground text-base hover:scale-105 transition-transform"
                  >
                    Bestelling plaatsen
                  </Button>
                </div>

                <p className="text-center text-muted-foreground font-body text-xs mt-6">
                  Betalen doe je straks bij het ophalen. Online betalen volgt binnenkort.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Floating cart button on non-menu steps */}
      {step !== "menu" && cart.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 right-4 sm:right-6 z-40"
        >
          <Button
            onClick={() => setCartOpen(true)}
            className="bg-primary text-primary-foreground rounded-full w-14 h-14 shadow-2xl hover:scale-110 transition-transform flex items-center justify-center relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </Button>
        </motion.div>
      )}

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-card border-l border-border z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-display text-xl font-extrabold text-foreground">
                  Winkelmand<span className="text-primary">.</span>
                </h2>
                <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground font-body text-sm text-center py-8">Je winkelmand is leeg</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="bg-background rounded-2xl p-4 border border-border">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-semibold text-foreground truncate">{item.name}</p>
                          {item.sauces.length > 0 && (
                            <p className="font-body text-xs text-muted-foreground mt-0.5">
                              + {item.sauces.map((s) => s.name).join(", ")}
                            </p>
                          )}
                        </div>
                        <span className="font-body text-sm font-bold text-primary whitespace-nowrap">
                          € {formatPrice(itemTotal(item))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-7 h-7 rounded-full bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-body text-sm font-bold text-foreground w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart({ name: item.name, price: item.price }, item.category)}
                            className="w-7 h-7 rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => deleteFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-5 border-t border-border space-y-3">
                  <div className="flex items-center justify-between font-body">
                    <span className="text-sm text-muted-foreground">Totaal</span>
                    <span className="text-lg font-extrabold text-foreground">€ {formatPrice(totalPrice)}</span>
                  </div>
                  <Button
                    onClick={() => {
                      setCartOpen(false);
                      if (step === "menu") setStep("timeslot");
                    }}
                    className="w-full bg-primary text-primary-foreground rounded-full py-6 font-body font-bold text-sm"
                  >
                    {step === "menu" ? "Verder naar tijdvak →" : "Sluiten"}
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  );
};

export default Bestellen;
