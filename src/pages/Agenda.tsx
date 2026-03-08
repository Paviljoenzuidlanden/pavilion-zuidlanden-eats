import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const events = [
  {
    date: "15",
    month: "Mrt",
    title: "Pubquiz Avond",
    time: "20:00 – 22:30",
    description: "Test je kennis met vrienden en win leuke prijzen! Teams van 2-6 personen.",
    category: "Quiz",
    spots: "Nog 8 plekken",
  },
  {
    date: "22",
    month: "Mrt",
    title: "Live Muziek: Akoustisch",
    time: "19:30 – 22:00",
    description: "Geniet van live akoestische muziek met een drankje en hapje erbij.",
    category: "Muziek",
    spots: "Vrije inloop",
  },
  {
    date: "29",
    month: "Mrt",
    title: "Bingo Middag",
    time: "14:00 – 17:00",
    description: "Gezellige bingo voor jong en oud. Mooie prijzen te winnen!",
    category: "Spel",
    spots: "Nog 20 plekken",
  },
  {
    date: "05",
    month: "Apr",
    title: "Kindermiddag",
    time: "13:00 – 16:00",
    description: "Springkussen, schmink en natuurlijk verse friet voor de kleintjes.",
    category: "Familie",
    spots: "Vrije inloop",
  },
  {
    date: "12",
    month: "Apr",
    title: "Wijnproeverij",
    time: "19:00 – 21:30",
    description: "Ontdek bijzondere wijnen in combinatie met onze borrelhapjes.",
    category: "Proeverij",
    spots: "Nog 12 plekken",
  },
  {
    date: "19",
    month: "Apr",
    title: "DJ Avond",
    time: "21:00 – 01:00",
    description: "Dansen tot in de late uurtjes met DJ sets en lekkere drankjes.",
    category: "Feest",
    spots: "Vrije inloop",
  },
];

const Agenda = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-foreground text-background">
        <div className="max-w-5xl mx-auto text-center">
          <motion.span
            className="text-primary font-body text-sm font-semibold tracking-[0.3em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Wat is er te doen?
          </motion.span>
          <motion.h1
            className="text-5xl md:text-8xl font-bold font-display tracking-tight uppercase mt-4 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Agenda
          </motion.h1>
          <motion.p
            className="text-background/60 font-body text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Van pubquiz tot live muziek — er is altijd iets te beleven bij Paviljoen Zuidlanden
          </motion.p>
        </div>
      </section>

      {/* Events list */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {events.map((event, i) => (
              <motion.div
                key={event.title}
                className="group bg-card rounded-2xl border border-border p-6 md:p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Date block */}
                  <div className="shrink-0 w-20 h-20 bg-primary rounded-xl flex flex-col items-center justify-center text-primary-foreground">
                    <span className="text-2xl font-bold font-display leading-none">{event.date}</span>
                    <span className="text-xs font-body uppercase tracking-wider mt-1">{event.month}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-body font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                      <span className="text-xs text-muted-foreground font-body">{event.spots}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-display text-foreground tracking-tight mb-1">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground font-body text-sm mb-3">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Paviljoen Zuidlanden
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 hidden md:block">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground tracking-tight mb-4">
              Zelf een feest organiseren?
            </h2>
            <p className="text-muted-foreground font-body text-lg mb-8">
              Van verjaardagen tot bedrijfsborrels — wij regelen het voor je
            </p>
            <Link
              to="/feest"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-body font-semibold tracking-wide uppercase hover:brightness-110 transition-all"
            >
              Feest organiseren
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-foreground text-center">
        <p className="text-background/30 font-body text-sm tracking-wide uppercase">
          © 2026 Paviljoen Zuidlanden
        </p>
      </footer>
    </div>
  );
};

export default Agenda;
