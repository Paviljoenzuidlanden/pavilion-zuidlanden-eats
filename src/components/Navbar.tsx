import { useState } from "react";
import { Menu, X, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo-new.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const mainLinks = isHome
    ? [
        { href: "#menu", label: "Menu" },
        { href: "#over-ons", label: "Over ons" },
        { href: "#contact", label: "Contact" },
      ]
    : [
        { href: "/", label: "Home", isRoute: true },
      ];

  const pageLinks = [
    { href: "/agenda", label: "Agenda", isRoute: true },
    { href: "/bezorging", label: "Bezorging", isRoute: true },
    { href: "/bestellen", label: "Bestellen", isRoute: true },
  ];

  const allLinks = [...mainLinks, ...pageLinks];

  const renderLink = (l: { href: string; label: string; isRoute?: boolean }, onClick?: () => void) =>
    l.isRoute ? (
      <Link
        key={l.href}
        to={l.href}
        onClick={onClick}
        className="text-foreground/60 hover:text-primary transition-colors font-body text-[13px] font-medium tracking-widest uppercase"
      >
        {l.label}<span className="text-primary">.</span>
      </Link>
    ) : (
      <a
        key={l.href}
        href={l.href}
        onClick={onClick}
        className="text-foreground/60 hover:text-primary transition-colors font-body text-[13px] font-medium tracking-widest uppercase"
      >
        {l.label}<span className="text-primary">.</span>
      </a>
    );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Paviljoen Zuidlanden" className="w-9 h-9 rounded-lg object-cover" />
          <span className="text-xl font-display font-extrabold text-foreground tracking-tight hidden sm:inline">
            PAVILJOEN<span className="text-primary">.</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {allLinks.map((l) => renderLink(l))}
          <Link
            to="/feest"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-body font-semibold text-[13px] tracking-wider uppercase hover:scale-105 transition-transform"
          >
            <PartyPopper className="w-4 h-4" />
            Feest
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden bg-background px-6 pb-6 flex flex-col gap-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {allLinks.map((l) => renderLink(l, () => setOpen(false)))}
            <Link
              to="/feest"
              onClick={() => setOpen(false)}
              className="block text-primary font-body font-semibold text-sm uppercase tracking-wider"
            >
              🎉 Feest organiseren
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
