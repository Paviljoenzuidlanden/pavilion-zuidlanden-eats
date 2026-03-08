import { useState } from "react";
import { Menu, X, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const links = [
    ...(isHome ? [
      { href: "#menu", label: "Menu" },
      { href: "#over-ons", label: "Over ons" },
      { href: "#contact", label: "Contact" },
    ] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-display font-bold text-primary">
          Paviljoen Zuidlanden
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-secondary-foreground/80 hover:text-primary transition-colors font-body tracking-wide story-link">
              {l.label}
            </a>
          ))}
          <Link
            to="/feest"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-sm font-body font-medium tracking-wide hover:brightness-110 transition-all text-sm uppercase"
          >
            <PartyPopper className="w-4 h-4" />
            Feest organiseren
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-secondary-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden bg-secondary px-4 pb-4 space-y-3 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-secondary-foreground/80 hover:text-primary font-body">
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
