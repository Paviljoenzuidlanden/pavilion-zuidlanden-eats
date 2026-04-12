import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingCart, Clock, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CartItem = {
  name: string;
  price: number;
  quantity: number;
  category: string;
};

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
  {
    category: "Sauzen",
    items: [
      { name: "Mayonaise", price: 0.65 },
      { name: "Ketchup", price: 0.65 },
      { name: "Curry", price: 0.65 },
      { name: "Pindasaus", price: 0.90 },
      { name: "Speciaal", price: 0.80 },
    ],
  },
];

const timeSlots = [
  "16:00 – 16:30",
  "16:30 – 17:00",
  "17:00 – 17:30",
  "17:30 – 18:00",
  "18:00 – 18:30",
  "18:30 – 19:00",
  "19:00 – 19:30",
  "19:30 – 20:00",
  "20:00 – 20:30",
];

const formatPrice = (price: number) =>
  price.toFixed(2).replace(".", ",");

const Bestellen = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"menu" | "timeslot" | "overview">("menu");

  const addToCart = (item: { name: string; price: number }, category: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === item.name);
      if (existing) {
        return prev.map((c) =>
          c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1, category }];
    });
  };

  const removeFromCart = (name: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === name);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.name === name ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.name !== name);
    });
  };

  const deleteFromCart = (name: string) => {
    setCart((prev) => prev.filter((c) => c.name !== name));
  };

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const getQuantity = (name: string) => cart.find((c) => c.name === name)?.quantity || 0;

  const handleOrder = () => {
    toast.success("Bestelling geplaatst!", {
      description: `Ophalen om ${selectedSlot}. Totaal: € ${formatPrice(totalPrice)}`,
    });
    setCart([]);
    setSelectedSlot(null);
    setStep("menu");
  };

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
              { key: "menu", label: "Kies producten" },
              { key: "timeslot", label: "Tijdvak" },
              { key: "overview", label: "Overzicht" },
            ].map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (s.key === "menu") setStep("menu");
                    if (s.key === "timeslot" && cart.length > 0) setStep("timeslot");
                    if (s.key === "overview" && cart.length > 0 && selectedSlot) setStep("overview");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body font-semibold uppercase tracking-wider transition-all ${
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
                {i < 2 && <div className="w-6 h-px bg-border" />}
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
                      <div className="space-y-3">
                        {cat.items.map((item) => {
                          const qty = getQuantity(item.name);
                          return (
                            <div
                              key={item.name}
                              className="flex items-center justify-between gap-3 py-2"
                            >
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
                                  <>
                                    <button
                                      onClick={() => removeFromCart(item.name)}
                                      className="w-8 h-8 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-7 text-center font-body text-sm font-bold text-foreground">
                                      {qty}
                                    </span>
                                  </>
                                )}
                                <button
                                  onClick={() => addToCart(item, cat.category)}
                                  className="w-8 h-8 rounded-full bg-primary text-primary-foreground hover:scale-110 flex items-center justify-center transition-transform"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
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
                        onClick={() => setStep("timeslot")}
                        className="w-full sm:w-auto bg-primary text-primary-foreground rounded-full px-8 py-6 font-body font-bold text-sm shadow-2xl hover:scale-105 transition-transform flex items-center gap-3"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{totalItems} items</span>
                        <span className="w-px h-4 bg-primary-foreground/30" />
                        <span>€ {formatPrice(totalPrice)}</span>
                        <span className="ml-1">→</span>
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
                    onClick={() => setStep("overview")}
                    disabled={!selectedSlot}
                    className="rounded-full px-8 font-body bg-primary text-primary-foreground"
                  >
                    Verder →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Overview */}
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
                      <div key={item.name} className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="font-body text-sm text-foreground block truncate">
                            {item.quantity}× {item.name}
                          </span>
                          <span className="font-body text-xs text-muted-foreground">
                            {item.category}
                          </span>
                        </div>
                        <span className="font-body text-sm font-semibold text-primary whitespace-nowrap">
                          € {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => deleteFromCart(item.name)}
                          className="w-7 h-7 rounded-full hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors text-muted-foreground"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                    <div className="flex items-center justify-between font-body text-lg font-bold">
                      <span className="text-foreground">Totaal</span>
                      <span className="text-primary">€ {formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("timeslot")}
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
      <FooterSection />
    </div>
  );
};

export default Bestellen;
