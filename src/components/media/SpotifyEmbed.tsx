export function SpotifyEmbed({
  id,
  type = "album",
  compact = false,
}: {
  id: string;
  type?: "album" | "track" | "artist" | "playlist";
  compact?: boolean;
}) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`}
      width="100%"
      height={compact ? 152 : 352}
      frameBorder={0}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="rounded-xl"
      title="Spotify player"
    />
  );
}

export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg-elevated">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
