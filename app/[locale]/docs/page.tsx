import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import DocsToc from "@/components/docs-toc";
import DocsContent from "@/components/docs-content";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function DocsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen scroll-smooth bg-[#020617] text-white">
      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-12">
        <DocsToc />
        <DocsContent />
      </div>
    </div>
  );
}
