"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { docsSectionIds, type DocsSectionId } from "@/lib/docs-sections";

export default function DocsToc() {
  const t = useTranslations("docs");
  const [activeId, setActiveId] = useState<DocsSectionId>(docsSectionIds[0]);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sectionElements = docsSectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const updateActiveFromScroll = () => {
      const scrollY = window.scrollY + 120;
      let current: DocsSectionId = docsSectionIds[0];

      for (const sectionId of docsSectionIds) {
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollY) {
          current = sectionId;
        }
      }

      setActiveId(current);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id as DocsSectionId);
        } else {
          updateActiveFromScroll();
        }
      },
      {
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveFromScroll);
    };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const activeLink = nav?.querySelector<HTMLAnchorElement>(
      `[data-toc-id="${activeId}"]`
    );
    if (!nav || !activeLink) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
      activeLink.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <aside className="sticky top-10 hidden h-[90vh] w-72 shrink-0 lg:block">
      <div className="flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-950/60 pr-1 shadow-xl shadow-black/20 backdrop-blur-sm">
        <div className="shrink-0 border-b border-slate-800/80 px-5 py-5">
          <h2 className="text-lg font-bold text-white">{t("toc.title")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {t("toc.description")}
          </p>
        </div>

        <nav
          ref={navRef}
          aria-label={t("toc.ariaLabel")}
          className="docs-toc-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4"
        >
          <ul className="space-y-0.5">
            {docsSectionIds.map((sectionId) => {
              const isActive = activeId === sectionId;

              return (
                <li key={sectionId}>
                  <a
                    href={`#${sectionId}`}
                    data-toc-id={sectionId}
                    aria-current={isActive ? "location" : undefined}
                    className={[
                      "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent font-medium text-cyan-300 shadow-[inset_2px_0_0_0] shadow-cyan-400"
                        : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200",
                        isActive
                          ? "scale-125 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                          : "bg-slate-600 group-hover:bg-slate-400",
                      ].join(" ")}
                    />
                    <span className="leading-snug">
                      {t(`sectionsNav.${sectionId}`)}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
