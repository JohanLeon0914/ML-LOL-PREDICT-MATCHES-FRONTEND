import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/language-switcher";
import NavLinks from "@/components/nav-links";

export default async function Navbar() {
  const t = await getTranslations("nav");

  return (
    <header className="border-b border-white/6 bg-gradient-to-r from-slate-900/60 via-transparent to-slate-900/30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-12">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-semibold text-white">
            {t("brand")}
          </Link>
          <span className="text-sm text-zinc-400">{t("tagline")}</span>
        </div>

        <div className="flex items-center gap-2">
          <NavLinks />
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
