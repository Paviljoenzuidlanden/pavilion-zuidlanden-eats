interface WaveDividerProps {
  /** Tailwind text-* color class that fills the wave (defaults to primary). */
  className?: string;
  flip?: boolean;
  /** Colour of the thin echo line above the wave. */
  stroke?: string;
}

/** Signature brand wave with a thin echo line, as used on the banners. */
const WaveDivider = ({ className = "text-primary", flip = false, stroke = "hsl(var(--background))" }: WaveDividerProps) => (
  <div className={`w-full leading-none ${flip ? "rotate-180" : ""} ${className}`} aria-hidden="true">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-12 sm:h-20 block">
      <path
        d="M0,64 C240,10 420,110 720,74 C1020,38 1200,4 1440,44 L1440,120 L0,120 Z"
        fill="currentColor"
      />
      <path
        d="M0,44 C240,-10 420,90 720,54 C1020,18 1200,-16 1440,24"
        fill="none"
        stroke="hsl(var(--background))"
        strokeWidth="3"
        opacity="0.8"
      />
    </svg>
  </div>
);

export default WaveDivider;
