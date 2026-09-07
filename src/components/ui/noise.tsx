import { cn } from "@/lib/utils";

export function Noise({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 h-full w-full opacity-20 mix-blend-overlay", className)}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#noiseFilter)"
        />
      </svg>
    </div>
  );
}
