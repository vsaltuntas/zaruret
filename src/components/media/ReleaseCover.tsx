import Image from "next/image";
import { cn } from "@/lib/cn";

const PALETTE = [
  { base: "#3a2244", accent: "#a870c8" },
  { base: "#1e3a3e", accent: "#5bc2c6" },
  { base: "#4a2418", accent: "#e08a5a" },
  { base: "#1a2c48", accent: "#6a9adf" },
  { base: "#3f1e2a", accent: "#d45a7a" },
  { base: "#2e3a1e", accent: "#a8c866" },
  { base: "#1e2e3a", accent: "#6aa8cc" },
  { base: "#3a2e1e", accent: "#d0a85a" },
  { base: "#2a1e3a", accent: "#8e6ad2" },
  { base: "#3a1e1e", accent: "#c85a5a" },
];

function paletteFor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>`;
const NOISE_URL = `url("data:image/svg+xml;utf8,${NOISE_SVG}")`;

export function ReleaseCover({
  cover,
  title,
  artistName,
  type,
  year,
  sizes,
  priority = false,
  className,
  imgClassName,
}: {
  cover?: string;
  title: string;
  artistName: string;
  type?: string;
  year?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const hasCover =
    !!cover &&
    cover !== "" &&
    !cover.endsWith("placeholder-cover.svg");

  if (hasCover) {
    return (
      <Image
        src={cover}
        alt={title}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imgClassName)}
      />
    );
  }

  const { base, accent } = paletteFor(`${artistName}::${title}`);
  const initial = title.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ backgroundColor: base }}
    >
      {/* radial light */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 10%, ${accent}55 0%, transparent 55%), radial-gradient(circle at 85% 90%, ${accent}22 0%, transparent 60%)`,
        }}
      />
      {/* ghost initial */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center select-none"
        style={{ color: accent, opacity: 0.08 }}
      >
        <span className="h-display font-bold leading-none tracking-tighter text-[14rem] md:text-[18rem]">
          {initial}
        </span>
      </div>
      {/* grain */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay opacity-60 pointer-events-none"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "160px 160px" }}
      />
      {/* bottom gradient for text legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-3/5"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
      />
      {/* typography */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/70 leading-tight line-clamp-2">
            {artistName}
          </div>
          {type && (
            <div className="text-[9px] uppercase tracking-[0.22em] text-white/55 whitespace-nowrap border border-white/20 rounded-full px-2 py-0.5">
              {type}
            </div>
          )}
        </div>
        <div>
          <div className="h-display text-2xl md:text-3xl lg:text-[2.25rem] leading-[1] tracking-tight text-white line-clamp-3">
            {title}
          </div>
          {year && (
            <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/50">
              {year}
            </div>
          )}
        </div>
      </div>
      {/* inner border */}
      <div
        aria-hidden
        className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none"
      />
    </div>
  );
}
