import heroImage from "@/assets/hero-fries.jpg";
import logo from "@/assets/logo.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-secondary/70" />
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <img
          src={logo}
          alt="Paviljoen Zuidlanden logo"
          className="w-40 h-40 mx-auto mb-8 rounded-full object-contain bg-background/90 p-2 shadow-lg"
        />
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4 font-display">
          Paviljoen Zuidlanden
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/80 font-body font-light tracking-wide mb-8">
          Verse friet met velletje · Ambachtelijk bereid
        </p>
        <a
          href="#menu"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-sm text-lg font-body font-medium tracking-wider uppercase hover:brightness-110 transition-all"
        >
          Bekijk het menu
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
