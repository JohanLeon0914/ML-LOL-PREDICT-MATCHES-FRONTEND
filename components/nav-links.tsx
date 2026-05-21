"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const navItems = [
  {
    href: "/" as const,
    labelKey: "home" as const,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    href: "/docs" as const,
    labelKey: "docs" as const,
    isActive: (pathname: string) => pathname.startsWith("/docs"),
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <>
      {navItems.map((item) => {
        const active = item.isActive(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "rounded-md px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-cyan-500/15 text-cyan-300 shadow-[inset_0_-2px_0_0] shadow-cyan-400"
                : "text-slate-200 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </>
  );
}
