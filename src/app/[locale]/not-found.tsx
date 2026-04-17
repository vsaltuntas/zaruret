import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24">
      <div className="container-site text-center">
        <div className="h-display text-[clamp(5rem,15vw,12rem)] tracking-tightest leading-none">
          404
        </div>
        <p className="mt-4 text-fg-muted">Sayfa bulunamadı. / Page not found.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Ana Sayfa / Home
        </Link>
      </div>
    </section>
  );
}
