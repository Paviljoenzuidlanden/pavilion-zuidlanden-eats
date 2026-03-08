import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PartyPopper, Calendar, Users, Sparkles, ChevronDown, Beer, GlassWater } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import partyImage from "@/assets/party-venue.jpg";
import feestSfeer from "@/assets/feest-sfeer.jpg";
import bierBar from "@/assets/bier-bar.jpg";
import bitterballen from "@/assets/bitterballen.jpg";
import frisdranken from "@/assets/frisdranken.jpg";
import barImage from "@/assets/bar.jpg";
import zaalImage from "@/assets/zaal.jpg";
import zaal2Image from "@/assets/zaal2.jpg";
import logo from "@/assets/logo.jpeg";

const marqueeItems = [
  "WARSTEINER", "·", "KÖNIG LUDWIG", "·", "BITTERBALLEN", "·",
  "COCA-COLA", "·", "FEEST", "·", "JUBILEUM", "·", "VERJAARDAG", "·",
  "WARSTEINER", "·", "KÖNIG LUDWIG", "·", "BITTERBALLEN", "·",
  "COCA-COLA", "·", "FEEST", "·", "JUBILEUM", "·", "VERJAARDAG", "·",
];

const galleryImages = [
  { src: feestSfeer, alt: "Feest sfeer" },
  { src: bierBar, alt: "Warsteiner bier" },
  { src: bitterballen, alt: "Bitterballen met König Ludwig" },
  { src: barImage, alt: "De bar" },
  { src: frisdranken, alt: "Frisdranken" },
  { src: zaalImage, alt: "De zaal" },
  { src: zaal2Image, alt: "Feestlocatie" },
  { src: feestSfeer, alt: "Feest sfeer" },
  { src: bierBar, alt: "Warsteiner bier" },
  { src: bitterballen, alt: "Bitterballen" },
  { src: frisdranken, alt: "Frisdranken" },
  { src: barImage, alt: "De bar" },
  { src: zaalImage, alt: "De zaal" },
  { src: zaal2Image, alt: "Feestlocatie" },
];

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
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.15]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", occasion: "", guests: "", date: "", message: "",
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
    <div className="min-h-screen bg-secondary text-secondary-foreground overflow-x-hidden">
      <Navbar />

      {/* Fullscreen Hero — Boostcafé style */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${partyImage})`, scale: heroScale }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/60 to-secondary" />

        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          <motion.img
            src={logo}
            alt="Logo"
            className="w-24 h-24 mx-auto mb-8 rounded-full object-contain bg-background/90 p-1.5 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          />
          <motion.h1
            className="text-5xl md:text-8xl font-bold text-primary-foreground mb-6 font-display leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Vier je feest<br />bij ons!
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-primary-foreground/70 font-body font-light mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Van verjaardag tot jubileum — wij maken er een onvergetelijke avond van
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <a
              href="#reserveer"
              className="bg-primary text-primary-foreground px-10 py-4 rounded-sm text-lg font-body font-medium tracking-wider uppercase hover:brightness-110 transition-all"
            >
              Reserveer nu
            </a>
            <a
              href="#aanbod"
              className="border-2 border-primary-foreground/30 text-primary-foreground px-10 py-4 rounded-sm text-lg font-body font-medium tracking-wider uppercase hover:border-primary hover:text-primary transition-all"
            >
              Bekijk aanbod
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-10 h-10 text-primary-foreground/40" />
        </motion.div>
      </section>

      {/* Scrolling photo strip — Boostcafé style marquee */}
      <section className="py-4 bg-secondary overflow-hidden">
        <motion.div
          className="flex gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {galleryImages.map((img, i) => (
            <div key={i} className="shrink-0 w-72 h-48 rounded-sm overflow-hidden">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Marquee text strip */}
      <div className="py-4 bg-primary overflow-hidden">
        <motion.div
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {marqueeItems.concat(marqueeItems).map((item, i) => (
            <span key={i} className="text-primary-foreground font-display text-lg font-bold tracking-widest">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Split sections — Boostcafé day/evening style */}
      <section id="aanbod" className="bg-secondary">
        {/* Bier section */}
        <div className="grid md:grid-cols-2 min-h-[80vh]">
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src={bierBar} alt="Warsteiner bier aan de bar" className="w-full h-full object-cover min-h-[50vh]" loading="lazy" />
          </motion.div>
          <motion.div
            className="flex flex-col justify-center p-10 md:p-16"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">Aan de bar</span>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-primary-foreground mb-6">
              Proost op het<br />leven
            </h2>
            <p className="text-secondary-foreground/70 font-body text-lg leading-relaxed mb-6">
              Geniet van een heerlijk Warsteiner pilsner of een König Ludwig Weissbier van de tap. 
              Perfect bij onze verse snacks en in de gezellige sfeer van ons paviljoen.
            </p>
            <div className="flex gap-3">
              <Beer className="w-6 h-6 text-primary" />
              <span className="text-secondary-foreground/60 font-body">Warsteiner · König Ludwig · Speciaalbieren</span>
            </div>
          </motion.div>
        </div>

        {/* Bitterballen section */}
        <div className="grid md:grid-cols-2 min-h-[80vh]">
          <motion.div
            className="flex flex-col justify-center p-10 md:p-16 order-2 md:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">Snacks & bites</span>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-primary-foreground mb-6">
              Borrelhapjes<br />die smaken
            </h2>
            <p className="text-secondary-foreground/70 font-body text-lg leading-relaxed mb-6">
              Onze knapperige bitterballen, gefrituurde snacks en ambachtelijke friet maken elk feest compleet. 
              Kies uit onze borrelkaart en geniet samen met je gasten.
            </p>
            <div className="flex gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-secondary-foreground/60 font-body">Bitterballen · Friet · Snacks · Borrelplanken</span>
            </div>
          </motion.div>
          <motion.div
            className="relative overflow-hidden order-1 md:order-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src={bitterballen} alt="Bitterballen met König Ludwig" className="w-full h-full object-cover min-h-[50vh]" loading="lazy" />
          </motion.div>
        </div>

        {/* Frisdranken section */}
        <div className="grid md:grid-cols-2 min-h-[80vh]">
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src={frisdranken} alt="Coca Cola en frisdranken" className="w-full h-full object-cover min-h-[50vh]" loading="lazy" />
          </motion.div>
          <motion.div
            className="flex flex-col justify-center p-10 md:p-16"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">Voor iedereen</span>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-primary-foreground mb-6">
              Verfrissend<br />& koud
            </h2>
            <p className="text-secondary-foreground/70 font-body text-lg leading-relaxed mb-6">
              Liever geen alcohol? Wij hebben een ruim assortiment aan frisdranken. Van ijskoude Coca-Cola 
              en Fanta tot Sprite en sappen — voor elk wat wils.
            </p>
            <div className="flex gap-3">
              <GlassWater className="w-6 h-6 text-primary" />
              <span className="text-secondary-foreground/60 font-body">Coca-Cola · Fanta · Sprite · Sappen</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee text strip 2 */}
      <div className="py-4 bg-primary overflow-hidden">
        <motion.div
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {["FEEST", "·", "VERJAARDAG", "·", "JUBILEUM", "·", "BORREL", "·", "BEDRIJFSFEEST", "·",
            "FEEST", "·", "VERJAARDAG", "·", "JUBILEUM", "·", "BORREL", "·", "BEDRIJFSFEEST", "·",
            "FEEST", "·", "VERJAARDAG", "·", "JUBILEUM", "·", "BORREL", "·", "BEDRIJFSFEEST", "·",
            "FEEST", "·", "VERJAARDAG", "·", "JUBILEUM", "·", "BORREL", "·", "BEDRIJFSFEEST", "·",
          ].map((item, i) => (
            <span key={i} className="text-primary-foreground font-display text-lg font-bold tracking-widest">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Sfeer gallery — big photo with parallax */}
      <section id="sfeer" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${feestSfeer})` }}
        />
        <div className="absolute inset-0 bg-secondary/50" />
        <motion.div
          className="relative z-10 text-center px-4 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <PartyPopper className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-bold font-display text-primary-foreground mb-6">
            Onvergetelijke avonden
          </h2>
          <p className="text-xl text-primary-foreground/70 font-body font-light mb-8">
            Of het nu een 40ste verjaardag, een 50-jarig jubileum of gewoon een gezellig feestje is — 
            bij Paviljoen Zuidlanden zorgen wij voor de perfecte sfeer met discolampen, muziek en alles wat je nodig hebt.
          </p>
          <a
            href="#reserveer"
            className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-sm text-lg font-body font-medium tracking-wider uppercase hover:brightness-110 transition-all"
          >
            Reserveer nu
          </a>
        </motion.div>
      </section>

      {/* USPs */}
      <section className="py-20 px-4 bg-secondary">
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {[
            { icon: Calendar, title: "Flexibele data", desc: "Kies een datum die bij jou past, ook op doordeweekse dagen" },
            { icon: Users, title: "Tot 80 gasten", desc: "Ruimte voor kleine en grote gezelschappen" },
            { icon: Sparkles, title: "Alles geregeld", desc: "Sfeerverlichting, muziek, hapjes en dranken" },
          ].map((item) => (
            <motion.div
              key={item.title}
              className="text-center"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-display text-primary-foreground mb-2">{item.title}</h3>
              <p className="text-secondary-foreground/60 font-body">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Reservation form */}
      <section id="reserveer" className="py-20 px-4 bg-background">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
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
                  <input type="text" name="name" required maxLength={100} value={form.name} onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">E-mail *</label>
                  <input type="email" name="email" required maxLength={255} value={form.email} onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Telefoon</label>
                  <input type="tel" name="phone" maxLength={20} value={form.phone} onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Aantal gasten *</label>
                  <input type="number" name="guests" required min={1} max={200} value={form.guests} onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Gelegenheid *</label>
                  <select name="occasion" required value={form.occasion} onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Kies een gelegenheid</option>
                    {occasions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Gewenste datum *</label>
                  <input type="date" name="date" required value={form.date} onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-1">Extra wensen of opmerkingen</label>
                <textarea name="message" rows={4} maxLength={1000} value={form.message} onChange={handleChange}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
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

      {/* Footer */}
      <div className="py-8 text-center bg-secondary border-t border-secondary-foreground/10">
        <Link
          to="/"
          className="text-primary hover:text-primary/80 transition-colors font-body font-medium text-lg"
        >
          ← Terug naar Paviljoen Zuidlanden
        </Link>
        <p className="text-secondary-foreground/40 font-body text-sm mt-4">
          © 2026 Paviljoen Zuidlanden · It Boumantsje, Leeuwarden
        </p>
      </div>
    </div>
  );
};

export default Events;
