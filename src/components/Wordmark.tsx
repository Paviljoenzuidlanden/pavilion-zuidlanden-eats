interface WordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  tagline?: boolean;
  tone?: "primary" | "light";
}

const sizes = {
  sm: "text-xl sm:text-2xl",
  md: "text-3xl sm:text-5xl",
  lg: "text-4xl sm:text-6xl md:text-7xl",
};

/** Brand lockup: PAVILJOEN — ZUIDLANDEN — with optional script tagline. */
const Wordmark = ({ className = "", size = "md", tagline = false, tone = "primary" }: WordmarkProps) => {
  const color = tone === "light" ? "text-secondary-foreground" : "text-primary";
  const rule = tone === "light" ? "bg-secondary-foreground/40" : "bg-primary/50";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className={`font-display font-medium uppercase leading-none tracking-[0.22em] ${sizes[size]} ${color}`}>
        Paviljoen
      </span>
      <span className="mt-2 flex items-center gap-3">
        <span className={`h-px w-6 sm:w-8 ${rule}`} />
        <span className={`font-display uppercase tracking-[0.4em] text-[10px] sm:text-xs ${color}`}>
          Zuidlanden
        </span>
        <span className={`h-px w-6 sm:w-8 ${rule}`} />
      </span>
      {tagline && (
        <span className={`font-script mt-4 text-xl sm:text-2xl md:text-3xl ${color}`}>
          De plek om samen te komen.
        </span>
      )}
    </div>
  );
};

export default Wordmark;
