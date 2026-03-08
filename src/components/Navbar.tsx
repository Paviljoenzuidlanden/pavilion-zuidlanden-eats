import { useState } from "react";
import { Menu, X, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const links = [
    ...(isHome
      ? [
          { href: "#menu", label: "Menu" },
          { href: "#over-ons", label: "Over ons" },
          { href: "#contact", label: "Contact" },
        ]
      : []),
    { href: "/agenda", label: "Agenda", isRoute: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-lg font-display font-bold text-foreground tracking-tight uppercase">
          PZ
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            (l as any).isRoute ? (
              <Link
                key={l.href}
                to={l.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-body text-sm tracking-wide uppercase"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-body text-sm tracking-wide uppercase"
              >
                {l.label}
              </a>
            )
          )}
          <Link
            to="/feest"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg font-body font-semibold tracking-wide text-sm uppercase hover:brightness-110 transition-all"
          >
            <PartyPopper className="w-4 h-4" />
            Feest organiseren
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden bg-background px-4 pb-4 space-y-3 overflow-hidden border-b border-border"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {links.map((l) =>
              (l as any).isRoute ? (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-muted-foreground hover:text-foreground font-body text-sm uppercase"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-muted-foreground hover:text-foreground font-body text-sm uppercase"
                >
                  {l.label}
                </a>
              )
            )}
            <Link
              to="/feest"
              onClick={() => setOpen(false)}
              className="block text-primary font-body font-semibold text-sm uppercase"
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
