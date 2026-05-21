import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HomeHero from "@/components/home-hero";
import MatchPredictor from "@/components/match-predictor";
import { getInitialMatchData } from "@/lib/match-data";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { teamOptions, championOptions, teamPlayers, playerOptions } =
    await getInitialMatchData();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.15),transparent),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(236,72,153,0.08),transparent)]"
        aria-hidden
      />

      <HomeHero />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-12">
        <MatchPredictor
          teamOptions={teamOptions}
          championOptions={championOptions}
          latestTeamPlayers={teamPlayers}
          playerOptions={playerOptions}
        />
      </div>
    </main>
  );
}
