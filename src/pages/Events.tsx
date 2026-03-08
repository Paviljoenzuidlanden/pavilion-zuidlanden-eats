import { useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Calendar, Users, Sparkles, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import partyImage from "@/assets/party-venue.jpg";

const occasions = [
  "Verjaardagsfeest",
  "40-jarig jubileum",
  "50-jarig jubileum",
  "Familiefeest",
  "Bedrijfsborrel",
  "Babyshower",
  "Pensioenfeest",
  "Overig",
];

const Events = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    occasion: "",
    guests: "",
    date: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${partyImage})` }}
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <PartyPopper className="w-14 h-14 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 font-display">
              Vier je feest bij ons!
            </h1>
            <p className="text-xl text-primary-foreground/80 font-body font-light">
              Van verjaardag tot jubileum — wij maken er een onvergetelijke avond van
            </p>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-primary-foreground/60" />
        </motion.div>
      </section>

      {/* USPs */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {[
            { icon: Calendar, title: "Flexibele data", desc: "Kies een datum die bij jou past, ook op doordeweekse dagen mogelijk" },
            { icon: Users, title: "Tot 80 gasten", desc: "Ons paviljoen biedt ruimte voor zowel kleine als grote gezelschappen" },
            { icon: Sparkles, title: "Sfeervolle locatie", desc: "Sfeerverlichting, muziek en decoratie — wij regelen het graag" },
          ].map((item) => (
            <motion.div
              key={item.title}
              className="text-center p-6"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            >
              <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold font-display text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground font-body">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Reservation form */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
              Reserveer jouw feest
            </h2>
            <p className="text-muted-foreground font-body text-lg">
              Vul het formulier in en wij nemen zo snel mogelijk contact met je op
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <PartyPopper className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold font-display text-foreground mb-3">Bedankt voor je aanvraag!</h3>
              <p className="text-muted-foreground font-body text-lg mb-6">
                We nemen zo snel mogelijk contact met je op om alles te bespreken.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-sm font-body font-medium tracking-wider uppercase hover:brightness-110 transition-all"
              >
                Terug naar home
              </button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Naam *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Telefoon</label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={20}
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Aantal gasten *</label>
                  <input
                    type="number"
                    name="guests"
                    required
                    min={1}
                    max={200}
                    value={form.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Gelegenheid *</label>
                  <select
                    name="occasion"
                    required
                    value={form.occasion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Kies een gelegenheid</option>
                    {occasions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Gewenste datum *</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={form.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-1">Extra wensen of opmerkingen</label>
                <textarea
                  name="message"
                  rows={4}
                  maxLength={1000}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 rounded-sm text-lg font-body font-medium tracking-wider uppercase hover:brightness-110 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Verstuur aanvraag
              </motion.button>
            </motion.form>
          )}
        </div>
      </section>

      {/* Back to home */}
      <div className="py-8 text-center bg-secondary">
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:text-primary/80 transition-colors font-body font-medium"
        >
          ← Terug naar Paviljoen Zuidlanden
        </button>
      </div>
    </div>
  );
};

export default Events;
