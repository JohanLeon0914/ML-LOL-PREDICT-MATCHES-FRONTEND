"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";

const locales: Locale[] = ["en", "es"];

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/60 p-1"
      role="group"
      aria-label={t("language")}
    >
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => router.replace(pathname, { locale: item })}
          className={[
            "rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition",
            locale === item
              ? "bg-cyan-500/20 text-cyan-300"
              : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
          ].join(" ")}
          aria-pressed={locale === item}
        >
          {item === "en" ? t("english") : t("spanish")}
        </button>
      ))}
    </div>
  );
}
