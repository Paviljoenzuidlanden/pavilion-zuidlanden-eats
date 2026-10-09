import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight, Users, Wine, X, CheckCircle2, Store } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import wyngaardLogo from "@/assets/dewyngaard-logo.png";

type AgendaEvent = {
  date: string;
  month: string;
  title: string;
  time: string;
  description: string;
  category: string;
  spots: string;
  organizer: string;
  coOrganizer?: string;
  teams?: boolean;
};

const MAX_QUIZ_TEAMS = 12;

const events: AgendaEvent[] = [
  {
    date: "01",
    month: "Nov",
    title: "Wijnproeverij",
    time: "14:00 – 17:00",
    description: "De Wyngaard neemt hun lekkerste wijnen mee om te proeven en te bestellen. Tip: bestel alvast voor de feestdagen.",
    category: "Proeverij",
    spots: "Vrije inloop",
    organizer: "paviljoen",
    coOrganizer: "wyngaard",
  },
  {
    date: "27",
    month: "Nov",
    title: "Jeugdsoos",
    time: "",
    description: "Gezellige avond voor de jeugd van de Zuidlanden, georganiseerd door het Wijkpanel.",
    category: "Jeugd",
    spots: "Vrije inloop",
    organizer: "wijkpanel",
  },
  {
    date: "10",
    month: "Dec",
    title: "Zuidlanden Pubquiz",
    time: "",
    description: "De echte Zuidlanden Pubquiz! Aanmelden verplicht — maximaal 12 teams van 4 personen. €2,50 per persoon.",
    category: "Quiz",
    spots: "Aanmelden verplicht",
    organizer: "paviljoen",
    teams: true,
  },
  {
    date: "15",
    month: "Jan",
    title: "Jeugdsoos",
    time: "",
    description: "Gezellige avond voor de jeugd van de Zuidlanden, georganiseerd door het Wijkpanel.",
    category: "Jeugd",
    spots: "Vrije inloop",
    organizer: "wijkpanel",
  },
  {
    date: "12",
    month: "Feb",
    title: "Jeugdsoos",
    time: "",
    description: "Gezellige avond voor de jeugd van de Zuidlanden, georganiseerd door het Wijkpanel.",
    category: "Jeugd",
    spots: "Vrije inloop",
    organizer: "wijkpanel",
  },
  {
    date: "12",
    month: "Mrt",
    title: "Jeugdsoos",
    time: "",
    description: "Gezellige avond voor de jeugd van de Zuidlanden, georganiseerd door het Wijkpanel.",
    category: "Jeugd",
    spots: "Vrije inloop",
    organizer: "wijkpanel",
  },
];

const Agenda = () => {
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [formData, setFormData] = useState({ naam: "", email: "", telefoon: "", team: "", size: "4" });
  const [submitted, setSubmitted] = useState(false);
  const [vol, setVol] = useState<Record<string, boolean>>({});

  useEffect(() => {
    events.filter((e) => e.teams).forEach(async (e) => {
      const { data } = await supabase.rpc("quiz_team_count", {
        _event_title: e.title,
        _event_date: `${e.date} ${e.month}`,
      });
      if (typeof data === "number") setVol((p) => ({ ...p, [e.title]: data >= MAX_QUIZ_TEAMS }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    const naam = formData.naam.trim(), email = formData.email.trim(), tel = formData.telefoon.trim();
    if (!naam || !/^\S+@\S+\.\S+$/.test(email) || naam.length > 100 || email.length > 255 || tel.length > 30) {
      toast({ title: "Vul een geldige naam en e-mail in", variant: "destructive" });
      return;
    }
    const eventDate = `${selectedEvent.date} ${selectedEvent.month}`;

    if (selectedEvent.teams) {
      const team = formData.team.trim();
      if (!team || team.length > 80) {
        toast({ title: "Geef een teamnaam op", variant: "destructive" });
        return;
      }
      const { data, error } = await supabase.rpc("register_quiz_team", {
        _event_title: selectedEvent.title,
        _event_date: eventDate,
        _team_name: team,
        _name: naam,
        _email: email,
        _phone: tel,
        _team_size: Number(formData.size),
      });
      if (error) {
        toast({ title: "Aanmelden mislukt, probeer het opnieuw", variant: "destructive" });
        return;
      }
      if (data === "vol") {
        setVol((p) => ({ ...p, [selectedEvent.title]: true }));
        toast({ title: "Alle 12 teams zijn vol", variant: "destructive" });
        return;
      }
      if (data === "team_bestaat") {
        toast({ title: "Deze teamnaam is al ingeschreven", variant: "destructive" });
        return;
      }
      if (data !== "ok") {
        toast({ title: "Aanmelden mislukt, probeer het opnieuw", variant: "destructive" });
        return;
      }
      setSubmitted(true);
      return;
    }

    const { error } = await supabase.from("event_signups").insert({
      event_title: selectedEvent.title,
      event_date: eventDate,
      name: naam, email, phone: tel || null,
    });
    if (error) {
      toast({ title: "Aanmelden mislukt, probeer het opnieuw", variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setFormData({ naam: "", email: "", telefoon: "", team: "", size: "4" });
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
            Bekijk wat er op de planning staat in het paviljoen
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
                    {event.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </span>
                    )}
                    {event.organizer !== "paviljoen" && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        Paviljoen Zuidlanden
                      </span>
                    )}
                    {event.organizer === "paviljoen" && (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold bg-primary text-primary-foreground">
                        <Store className="w-3 h-3" /> Paviljoen Zuidlanden
                      </span>
                    )}
                    {event.organizer !== "paviljoen" && (
                      <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold ${
                        event.organizer === "wyngaard"
                          ? "bg-muted text-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}>
                        {event.organizer === "wyngaard" ? (
                          <><Wine className="w-3 h-3" /> De Wyngaard</>
                        ) : (
                          <><Users className="w-3 h-3" /> Wijkpanel Zuidlanden</>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  {(event.organizer === "wyngaard" || event.coOrganizer === "wyngaard") && (
                    <a
                      href="https://www.dewyngaard.nl"
                      target="_blank"
                      rel="noreferrer"
                      title="Naar de website van De Wyngaard"
                      className="hover:opacity-75 transition-opacity"
                    >
                      <img src={wyngaardLogo} alt="De Wyngaard" className="h-8 w-auto" />
                    </a>
                  )}
                  {event.spots !== "Vrije inloop" ? (
                    vol[event.title] ? (
                      <span className="text-xs font-body font-semibold uppercase tracking-widest text-primary">Vol</span>
                    ) : (
                      <Button
                        size="sm"
                        className="rounded-full font-body font-semibold tracking-widest text-xs uppercase"
                        onClick={() => setSelectedEvent(event)}
                      >
                        Aanmelden
                      </Button>
                    )
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
                      <p className="text-xs text-muted-foreground font-body">{selectedEvent.time || selectedEvent.spots}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {selectedEvent.teams && (
                      <>
                        <div>
                          <label className="text-xs font-body font-semibold text-foreground uppercase tracking-widest mb-1.5 block">Teamnaam *</label>
                          <Input
                            value={formData.team}
                            onChange={(e) => setFormData(prev => ({ ...prev, team: e.target.value }))}
                            placeholder="Naam van jullie team"
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-body font-semibold text-foreground uppercase tracking-widest mb-1.5 block">
                            Aantal personen * <span className="normal-case tracking-normal font-normal">(max. 4)</span>
                          </label>
                          <select
                            value={formData.size}
                            onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-body text-foreground"
                          >
                            {[1, 2, 3, 4].map((n) => (
                              <option key={n} value={String(n)}>{n} {n === 1 ? "persoon" : "personen"}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="text-xs font-body font-semibold text-foreground uppercase tracking-widest mb-1.5 block">
                        {selectedEvent.teams ? "Jouw naam *" : "Naam *"}
                      </label>
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
                  <h3 className="text-xl font-extrabold font-display text-foreground tracking-tight mb-2 break-words">Bedankt, {formData.naam.trim()}!</h3>
                  <p className="text-muted-foreground font-body text-sm mb-3">
                    Bedankt voor je aanmelding voor <strong>{selectedEvent.title}</strong> op {selectedEvent.date} {selectedEvent.month}.
                  </p>
                  {selectedEvent.teams && (
                    <p className="text-muted-foreground font-body text-sm mb-3">
                      We hebben <strong>{formData.team.trim()}</strong> ({formData.size} {formData.size === "1" ? "persoon" : "personen"}) voor je genoteerd.
                    </p>
                  )}
                  <p className="text-muted-foreground font-body text-sm mb-6">
                    Je ontvangt binnenkort een bevestiging van je aanmelding.
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
