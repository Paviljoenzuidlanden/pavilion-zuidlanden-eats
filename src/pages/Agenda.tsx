import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight, Building2, Users, X, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const events = [
  {
    date: "15",
    month: "Mrt",
    title: "Pubquiz Avond",
    time: "20:00 – 22:30",
    description: "Test je kennis met vrienden en win leuke prijzen! Teams van 2-6 personen.",
    category: "Quiz",
    spots: "Nog 8 plekken",
    organizer: "paviljoen",
  },
  {
    date: "22",
    month: "Mrt",
    title: "Live Muziek: Akoustisch",
    time: "19:30 – 22:00",
    description: "Geniet van live akoestische muziek met een drankje en hapje erbij.",
    category: "Muziek",
    spots: "Vrije inloop",
    organizer: "paviljoen",
  },
  {
    date: "29",
    month: "Mrt",
    title: "Bingo Middag",
    time: "14:00 – 17:00",
    description: "Gezellige bingo voor jong en oud. Mooie prijzen te winnen!",
    category: "Spel",
    spots: "Nog 20 plekken",
    organizer: "wijkpanel",
  },
  {
    date: "05",
    month: "Apr",
    title: "Kindermiddag",
    time: "13:00 – 16:00",
    description: "Springkussen, schmink en natuurlijk verse friet voor de kleintjes.",
    category: "Familie",
    spots: "Vrije inloop",
    organizer: "wijkpanel",
  },
  {
    date: "12",
    month: "Apr",
    title: "Wijnproeverij",
    time: "19:00 – 21:30",
    description: "Ontdek bijzondere wijnen in combinatie met onze borrelhapjes.",
    category: "Proeverij",
    spots: "Nog 12 plekken",
    organizer: "paviljoen",
  },
  {
    date: "19",
    month: "Apr",
    title: "DJ Avond",
    time: "21:00 – 01:00",
    description: "Dansen tot in de late uurtjes met DJ sets en lekkere drankjes.",
    category: "Feest",
    spots: "Vrije inloop",
    organizer: "paviljoen",
  },
];

const Agenda = () => {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [formData, setFormData] = useState({ naam: "", email: "", telefoon: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.naam || !formData.email) {
      toast({ title: "Vul je naam en e-mail in", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Aanmelding ontvangen!", description: `Je bent aangemeld voor ${selectedEvent?.title}` });
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setFormData({ naam: "", email: "", telefoon: "" });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 bg-secondary text-secondary-foreground">
        <div className="max-w-5xl mx-auto text-center">
          <motion.span
            className="text-primary font-body text-xs font-semibold tracking-[0.4em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Wat is er te doen?
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-6xl md:text-[9rem] font-extrabold font-display tracking-tighter uppercase mt-6 mb-6 leading-[0.85]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Agenda<span className="text-primary">.</span>
          </motion.h1>
          <motion.p
            className="text-secondary-foreground/50 font-body text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Van pubquiz tot live muziek — er is altijd iets te beleven
          </motion.p>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              className="group bg-card rounded-2xl border border-border p-6 md:p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="shrink-0 w-20 h-20 bg-primary rounded-2xl flex flex-col items-center justify-center text-primary-foreground">
                  <span className="text-2xl font-extrabold font-display leading-none">{event.date}</span>
                  <span className="text-[10px] font-body uppercase tracking-widest mt-1">{event.month}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-body font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-body tracking-wider uppercase">{event.spots}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold font-display text-foreground tracking-tight mb-1">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm mb-3">{event.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-body tracking-wider uppercase flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      Paviljoen Zuidlanden
                    </span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold ${
                      event.organizer === "paviljoen"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent text-accent-foreground"
                    }`}>
                      {event.organizer === "paviljoen" ? (
                        <><Building2 className="w-3 h-3" /> Paviljoen Zuidlanden</>
                      ) : (
                        <><Users className="w-3 h-3" /> Wijkpanel Zuidlanden</>
                      )}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  {event.spots !== "Vrije inloop" ? (
                    <Button
                      size="sm"
                      className="rounded-full font-body font-semibold tracking-widest text-xs uppercase"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Aanmelden
                    </Button>
                  ) : (
                    <span className="text-xs font-body text-muted-foreground italic">Vrije inloop</span>
                  )}
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all hidden md:block" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Aanmeld Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={closeModal} />
            <motion.div
              className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md p-8 z-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>

              {!submitted ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-xl flex flex-col items-center justify-center text-primary-foreground shrink-0">
                      <span className="text-lg font-extrabold font-display leading-none">{selectedEvent.date}</span>
                      <span className="text-[8px] font-body uppercase tracking-widest">{selectedEvent.month}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold font-display text-foreground tracking-tight">{selectedEvent.title}</h3>
                      <p className="text-xs text-muted-foreground font-body">{selectedEvent.time}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-body font-semibold text-foreground uppercase tracking-widest mb-1.5 block">Naam *</label>
                      <Input
                        value={formData.naam}
                        onChange={(e) => setFormData(prev => ({ ...prev, naam: e.target.value }))}
                        placeholder="Je volledige naam"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-body font-semibold text-foreground uppercase tracking-widest mb-1.5 block">E-mail *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="je@email.nl"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-body font-semibold text-foreground uppercase tracking-widest mb-1.5 block">Telefoon</label>
                      <Input
                        type="tel"
                        value={formData.telefoon}
                        onChange={(e) => setFormData(prev => ({ ...prev, telefoon: e.target.value }))}
                        placeholder="06-12345678"
                        className="rounded-xl"
                      />
                    </div>
                    <Button type="submit" className="w-full rounded-full font-body font-semibold tracking-widest text-sm uppercase mt-2">
                      Aanmelden
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-extrabold font-display text-foreground tracking-tight mb-2">Aangemeld!</h3>
                  <p className="text-muted-foreground font-body text-sm mb-6">
                    Je bent aangemeld voor <strong>{selectedEvent.title}</strong> op {selectedEvent.date} {selectedEvent.month}.
                  </p>
                  <Button onClick={closeModal} variant="outline" className="rounded-full font-body font-semibold tracking-widest text-xs uppercase">
                    Sluiten
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-6xl font-extrabold font-display text-foreground tracking-tight mb-4">
              Zelf een feest<span className="text-primary">?</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg mb-10">
              Van verjaardagen tot bedrijfsborrels — wij regelen het voor je
            </p>
            <Link
              to="/feest"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-semibold tracking-widest text-sm uppercase hover:scale-105 transition-transform"
            >
              Feest organiseren
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-6 bg-secondary text-center">
        <p className="text-secondary-foreground/30 font-body text-xs tracking-widest uppercase">
          © 2026 Paviljoen Zuidlanden
        </p>
      </footer>
    </div>
  );
};

export default Agenda;
