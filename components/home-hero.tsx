import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function HomeHero() {
  const t = await getTranslations("home");

  const features = [
    { label: t("features.teams"), icon: "" },
    { label: t("features.rosters"), icon: "" },
    { label: t("features.model"), icon: "" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/league-of-legends-worlds-2026-texas-new-york.jpg"
          alt={t("imageAlt")}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
            {t("badge")}
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("title")}
            <span className="mt-2 block bg-gradient-to-r from-fuchsia-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {t("description")}
          </p>

        </div>
      </div>

      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
    </section>
  );
}
