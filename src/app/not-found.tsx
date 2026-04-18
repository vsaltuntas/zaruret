import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1 style={{ fontSize: "clamp(5rem, 15vw, 12rem)", margin: 0, letterSpacing: "-0.04em" }}>
          404
        </h1>
        <p style={{ color: "#888", marginTop: "1rem" }}>
          Sayfa bulunamadı / Page not found
        </p>
        <Link
          href="/tr/"
          style={{
            display: "inline-block",
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            background: "#fafafa",
            color: "#0a0a0a",
            borderRadius: "999px",
            textDecoration: "none",
          }}
        >
          Ana Sayfa / Home
        </Link>
      </div>
    </main>
  );
}
