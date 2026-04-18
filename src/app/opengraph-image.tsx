import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Zaruret Records";
export const dynamic = "force-static";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(212,175,55,0.25), transparent 60%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#888",
          }}
        >
          MUSIC — LABEL — STUDIO — EVENTS
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 180,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            ZARURET
            <span style={{ color: "#d4af37" }}>.</span>
          </div>
          <div
            style={{
              fontSize: 40,
              color: "#888",
              marginTop: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            An independent music house.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#666",
          }}
        >
          <div>zaruret.com</div>
          <div style={{ color: "#d4af37" }}>✦</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
