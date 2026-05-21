import { getTranslations } from "next-intl/server";

const LINKS = [
  {
    href: "https://johan-leon-web-developer.vercel.app",
    labelKey: "portfolio" as const,
  },
  {
    href: "https://github.com/JohanLeon0914",
    labelKey: "github" as const,
  },
  {
    href: "https://www.linkedin.com/in/johan-alberto-leon-18b688229/",
    labelKey: "linkedin" as const,
  },
];

export default async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-gradient-to-r from-slate-950 via-slate-900/40 to-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-white">Johan León</p>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">{t("role")}</p>
          <p className="text-xs text-slate-500">
            {t("builtBy")}{" "}
            <span className="font-medium text-slate-300">Johan León</span>
            {" · "}
            © {year} {t("rights")}
          </p>
        </div>

        <nav
          aria-label={t("linksAria")}
          className="flex flex-wrap items-center gap-3"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              {t(link.labelKey)}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
