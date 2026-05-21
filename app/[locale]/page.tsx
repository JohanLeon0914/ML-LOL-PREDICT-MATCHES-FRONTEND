import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.14),_transparent_35%),linear-gradient(180deg,_#050816_0%,_#101828_100%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
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
