import interiorImage from "@/assets/interior.jpg";

const AboutSection = () => {
  return (
    <section id="over-ons" className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-6 font-display">
            Eerlijk & Ambachtelijk
          </h2>
          <div className="w-16 h-1 bg-primary mb-6" />
          <p className="text-muted-foreground text-lg leading-relaxed mb-4 font-body">
            Bij Paviljoen Zuidlanden geloven we in de kracht van eenvoud. Onze friet wordt dagelijks vers gesneden van echte aardappelen — met velletje, zoals het hoort.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed font-body">
            Gelegen in het hart van de Zuidlanden, omringd door weilanden en natuur, is ons paviljoen de perfecte plek om te genieten van een ambachtelijke snack in een ontspannen sfeer.
          </p>
        </div>
        <div className="rounded-sm overflow-hidden shadow-xl">
          <img
            src={interiorImage}
            alt="Interieur van Paviljoen Zuidlanden"
            className="w-full h-80 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
