-- Instelbaar aantal consumptiemunten per persoon voor de indicatieve drankbegroting (standaard 5)
ALTER TABLE public.quotes ADD COLUMN drink_tokens_per_guest integer NOT NULL DEFAULT 5;

COMMENT ON COLUMN public.quotes.drink_tokens_per_guest IS 'Munten per persoon in de indicatieve drankbegrotingstabel';
