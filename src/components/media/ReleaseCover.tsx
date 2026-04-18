import Image from "next/image";
import { cn } from "@/lib/cn";

export function ReleaseCover({
  cover,
  title,
  artistName,
  sizes,
  priority = false,
  className,
  imgClassName,
}: {
  cover?: string;
  title: string;
  artistName: string;
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

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col justify-between p-4 md:p-5",
        "bg-gradient-to-br from-[#1f1f1f] via-[#141414] to-[#0a0a0a]",
        className
      )}
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-fg-muted/80 leading-tight line-clamp-2">
        {artistName}
      </div>
      <div className="h-display text-xl md:text-2xl lg:text-3xl leading-[1] tracking-tight text-fg line-clamp-4">
        {title}
      </div>
    </div>
  );
}
