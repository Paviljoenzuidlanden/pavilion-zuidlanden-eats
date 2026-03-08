import { useState } from "react";
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
import logo from "/lovable-uploads/20a30610-a3ae-46ec-95f7-78f6347e519e.png";

const galleryImages = [
{ src: feestSfeer, alt: "Feest sfeer" },
{ src: bierBar, alt: "Bier aan de bar" },
{ src: bitterballen, alt: "Bitterballen" },
{ src: barImage, alt: "De bar" },
{ src: frisdranken, alt: "Frisdranken" },
{ src: zaalImage, alt: "De zaal" },
{ src: zaal2Image, alt: "Feestlocatie" },
{ src: feestSfeer, alt: "Feest sfeer" },
{ src: bierBar, alt: "Bier aan de bar" },
{ src: bitterballen, alt: "Bitterballen" },
{ src: frisdranken, alt: "Frisdranken" },
{ src: barImage, alt: "De bar" },
{ src: zaalImage, alt: "De zaal" },
{ src: zaal2Image, alt: "Feestlocatie" }];


const occasions = [
"Verjaardagsfeest",
"40-jarig jubileum",
"50-jarig jubileum",
"Familiefeest",
"Bedrijfsborrel",
"Babyshower",
"Pensioenfeest",
"Overig"];


const Events = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.15]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", occasion: "", guests: "", date: "", message: ""
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

      {/* Fullscreen Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${partyImage})`, scale: heroScale }} />
        
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/60 to-secondary" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          style={{ opacity: heroOpacity }}>
          
          <motion.img
            src={logo}
            alt="Logo"
            className="w-20 h-20 mx-auto mb-10 rounded-2xl object-contain bg-background/90 p-1 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }} />
          
          <motion.h1
            className="text-6xl md:text-[9rem] font-extrabold text-secondary-foreground mb-6 font-display leading-[0.85] tracking-tighter"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            
            Vier je feest<span className="text-primary">!</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-secondary-foreground/60 font-body font-light mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}>
            
            Van verjaardag tot jubileum — wij maken er een onvergetelijke avond van
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}>
            
            <a
              href="#reserveer"
              className="bg-primary text-primary-foreground px-10 py-4 rounded-full text-sm font-body font-semibold tracking-widest uppercase hover:scale-105 transition-transform">
              
              Reserveer nu
            </a>
            <a
              href="#aanbod"
              className="border-2 border-secondary-foreground/20 text-secondary-foreground px-10 py-4 rounded-full text-sm font-body font-semibold tracking-widest uppercase hover:border-primary hover:text-primary transition-all">
              
              Bekijk aanbod
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          
          <ChevronDown className="w-8 h-8 text-secondary-foreground/30" />
        </motion.div>
      </section>

      {/* Photo strip */}
      <section className="py-4 bg-secondary overflow-hidden">
        <motion.div
          className="flex gap-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
          
          {galleryImages.map((img, i) =>
          <div key={i} className="shrink-0 w-64 h-44 rounded-xl overflow-hidden">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="py-4 bg-primary overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {Array(6).fill(["FEEST", "·", "VERJAARDAG", "·", "JUBILEUM", "·", "BORREL", "·"]).flat().map((item, i) =>
          <span key={i} className="text-primary-foreground font-display text-sm font-bold tracking-[0.3em] uppercase">
              {item}
            </span>
          )}
        </div>
      </div>

      {/* Split sections */}
      <section id="aanbod" className="bg-secondary">
        <div className="grid md:grid-cols-2 min-h-[80vh]">
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            
            <img src={bierBar} alt="Bier aan de bar" className="w-full h-full object-cover min-h-[50vh]" loading="lazy" />
          </motion.div>
          <motion.div
            className="flex flex-col justify-center p-10 md:p-20"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}>
            
            <span className="text-primary font-body text-xs tracking-[0.4em] uppercase mb-4">Aan de bar</span>
            <h2 className="text-4xl md:text-6xl font-extrabold font-display text-secondary-foreground mb-6 tracking-tight leading-[0.95]">
              Proost op het leven<span className="text-primary">.</span>
            </h2>
            <p className="text-secondary-foreground/60 font-body text-lg leading-relaxed mb-6">
              Geniet van een heerlijk pilsner of een verfrissend weissbier van de tap.
            </p>
            <div className="flex gap-3 items-center">
              <Beer className="w-5 h-5 text-primary" />
              <span className="text-secondary-foreground/50 font-body text-sm">Pilsner · Weissbier · Speciaalbieren</span>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 min-h-[80vh]">
          <motion.div
            className="flex flex-col justify-center p-10 md:p-20 order-2 md:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}>
            
            <span className="text-primary font-body text-xs tracking-[0.4em] uppercase mb-4">Snacks & bites</span>
            <h2 className="text-4xl font-extrabold font-display text-secondary-foreground mb-6 tracking-tight leading-[0.95] md:text-5xl">
              Borrelhapjes die smaken<span className="text-primary">.</span>
            </h2>
            <p className="text-secondary-foreground/60 font-body text-lg leading-relaxed mb-6">
              Knapperige bitterballen, gefrituurde snacks en ambachtelijke friet maken elk feest compleet.
            </p>
            <div className="flex gap-3 items-center">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-secondary-foreground/50 font-body text-sm">Bitterballen · Friet · Snacks · Borrelplanken</span>
            </div>
          </motion.div>
          <motion.div
            className="relative overflow-hidden order-1 md:order-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            
            <img src={bitterballen} alt="Bitterballen" className="w-full h-full object-cover min-h-[50vh]" loading="lazy" />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 min-h-[80vh]">
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            
            <img src={frisdranken} alt="Frisdranken" className="w-full h-full object-cover min-h-[50vh]" loading="lazy" />
          </motion.div>
          <motion.div
            className="flex flex-col justify-center p-10 md:p-20"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}>
            
            <span className="text-primary font-body text-xs tracking-[0.4em] uppercase mb-4">Voor iedereen</span>
            <h2 className="text-4xl md:text-6xl font-extrabold font-display text-secondary-foreground mb-6 tracking-tight leading-[0.95]">
              Verfrissend & koud<span className="text-primary">.</span>
            </h2>
            <p className="text-secondary-foreground/60 font-body text-lg leading-relaxed mb-6">
              Liever geen alcohol? Wij hebben een ruim assortiment aan frisdranken.
            </p>
            <div className="flex gap-3 items-center">
              <GlassWater className="w-5 h-5 text-primary" />
              <span className="text-secondary-foreground/50 font-body text-sm">Coca-Cola · Fanta · Sprite · Sappen</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Parallax CTA */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${feestSfeer})` }} />
        
        <div className="absolute inset-0 bg-secondary/60" />
        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}>
          
          <PartyPopper className="w-14 h-14 text-primary mx-auto mb-6" />
          <h2 className="text-5xl md:text-7xl font-extrabold font-display text-secondary-foreground mb-6 tracking-tight">
            Onvergetelijke avonden<span className="text-primary">.</span>
          </h2>
          <p className="text-xl text-secondary-foreground/60 font-body font-light mb-10">
            Bij Paviljoen Zuidlanden zorgen wij voor de perfecte sfeer met discolampen, muziek en alles wat je nodig hebt.
          </p>
          <a
            href="#reserveer"
            className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full text-sm font-body font-semibold tracking-widest uppercase hover:scale-105 transition-transform">
            
            Reserveer nu
          </a>
        </motion.div>
      </section>

      {/* USPs */}
      <section className="py-24 px-6 bg-secondary">
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
          
          {[
          { icon: Calendar, title: "Flexibele data", desc: "Kies een datum die bij jou past, ook doordeweeks" },
          { icon: Users, title: "Tot 80 gasten", desc: "Ruimte voor kleine en grote gezelschappen" },
          { icon: Sparkles, title: "Alles geregeld", desc: "Sfeerverlichting, muziek, hapjes en dranken" }].
          map((item) =>
          <motion.div
            key={item.title}
            className="text-center"
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold font-display text-secondary-foreground mb-2">{item.title}</h3>
              <p className="text-secondary-foreground/50 font-body text-sm">{item.desc}</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Reservation form */}
      <section id="reserveer" className="py-24 px-6 bg-background">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12">
            
            <h2 className="text-4xl md:text-6xl font-extrabold font-display text-foreground mb-4 tracking-tight">
              Reserveer jouw feest<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg">
              Vul het formulier in en wij nemen contact op
            </p>
          </motion.div>

          {submitted ?
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}>
            
              <PartyPopper className="w-14 h-14 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-extrabold font-display text-foreground mb-3">Bedankt!</h3>
              <p className="text-muted-foreground font-body text-lg mb-8">
                We nemen zo snel mogelijk contact met je op.
              </p>
              <button
              onClick={() => navigate("/")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-body font-semibold tracking-widest text-sm uppercase hover:scale-105 transition-transform">
              
                Terug naar home
              </button>
            </motion.div> :

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-2 tracking-wider uppercase">Naam *</label>
                  <input type="text" name="name" required maxLength={100} value={form.name} onChange={handleChange}
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-2 tracking-wider uppercase">E-mail *</label>
                  <input type="email" name="email" required maxLength={255} value={form.email} onChange={handleChange}
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-2 tracking-wider uppercase">Telefoon</label>
                  <input type="tel" name="phone" maxLength={20} value={form.phone} onChange={handleChange}
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-2 tracking-wider uppercase">Aantal gasten *</label>
                  <input type="number" name="guests" required min={1} max={200} value={form.guests} onChange={handleChange}
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-2 tracking-wider uppercase">Gelegenheid *</label>
                  <select name="occasion" required value={form.occasion} onChange={handleChange}
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow">
                    <option value="">Kies een gelegenheid</option>
                    {occasions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-2 tracking-wider uppercase">Gewenste datum *</label>
                  <input type="date" name="date" required value={form.date} onChange={handleChange}
                className="w-full px-4 py-3.5 bg-card border border-border rounded-xl font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-foreground mb-2 tracking-wider uppercase">Extra wensen</label>
                <textarea name="message" rows={4} maxLength={1000} value={form.message} onChange={handleChange}
              className="w-full px-4 py-3.5 bg-card border border-border rounded-xl font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-shadow" />
              </div>
              <motion.button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-full text-sm font-body font-semibold tracking-widest uppercase hover:scale-[1.02] transition-transform"
              whileTap={{ scale: 0.98 }}>
              
                Verstuur aanvraag
              </motion.button>
            </motion.form>
          }
        </div>
      </section>

      {/* Footer */}
      <div className="py-10 text-center bg-secondary border-t border-secondary-foreground/10">
        <Link
          to="/"
          className="text-primary hover:text-accent transition-colors font-body font-semibold text-sm tracking-wider uppercase">
          
          ← Terug naar home
        </Link>
        <p className="text-secondary-foreground/30 font-body text-xs mt-4 tracking-widest uppercase">
          © 2026 Paviljoen Zuidlanden
        </p>
      </div>
    </div>);

};

export default Events;