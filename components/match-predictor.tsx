"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Select from "react-select";
import type { TeamOption, TeamPlayerData } from "@/lib/match-data";

const emptyPositions = ["top", "jng", "mid", "bot", "sup"] as const;

function formatLatestGame(date: string, locale: string) {
  return new Date(date).toLocaleString(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

type SelectOption = {
  label: string;
  value: string;
};

type PlayerAssignment = {
  playerId: string;
  playerName: string;
  position: string;
  champion: string;
};

type Props = {
  teamOptions: TeamOption[];
  championOptions: string[];
  latestTeamPlayers: Record<string, TeamPlayerData>;
  playerOptions?: string[];
};

const selectStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: "#020617",
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    minHeight: 48,
    boxShadow: "none",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#051128",
    borderRadius: 20,
    overflow: "hidden",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#7c3aed" : "#020617",
    color: "#f8fafc",
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#f8fafc",
  }),
  input: (base: any) => ({
    ...base,
    color: "#f8fafc",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#94a3b8",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "#94a3b8",
  }),
  indicatorSeparator: (base: any) => ({ ...base, backgroundColor: "transparent" }),
};

export default function MatchPredictor({
  teamOptions,
  championOptions,
  latestTeamPlayers,
}: Props) {
  const t = useTranslations("predictor");
  const locale = useLocale();

  const positionLabels = useMemo(
    () => ({
      top: t("positions.top"),
      jng: t("positions.jng"),
      mid: t("positions.mid"),
      bot: t("positions.bot"),
      sup: t("positions.sup"),
    }),
    [t]
  );

  const createEmptyPlayers = useCallback((): PlayerAssignment[] => {
    return emptyPositions.map((position) => ({
      playerId: "",
      playerName: t("positions.empty", {
        role: positionLabels[position],
      }),
      position,
      champion: "",
    }));
  }, [positionLabels, t]);

  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");
  const [team1Bans, setTeam1Bans] = useState<string[]>(["", "", "", "", ""]);
  const [team2Bans, setTeam2Bans] = useState<string[]>(["", "", "", "", ""]);
  const [team1Players, setTeam1Players] = useState<PlayerAssignment[]>([]);
  const [team2Players, setTeam2Players] = useState<PlayerAssignment[]>([]);

  useEffect(() => {
    setTeam1Players(createEmptyPlayers());
    setTeam2Players(createEmptyPlayers());
  }, [createEmptyPlayers]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prediction, setPrediction] = useState<{ prediction: number; probability: number; threshold: number } | null>(null);

  const team1 = useMemo(
    () => teamOptions.find((item) => item.id === team1Id),
    [team1Id, teamOptions]
  );
  const team2 = useMemo(
    () => teamOptions.find((item) => item.id === team2Id),
    [team2Id, teamOptions]
  );

  const teamSelectOptions: SelectOption[] = teamOptions.map((team) => ({
    label: team.name,
    value: team.id,
  }));

  const championSelectOptions: SelectOption[] = championOptions.map((champion) => ({
    label: champion,
    value: champion,
  }));

  const team1PlayerOptions: SelectOption[] = team1Id
    ? (latestTeamPlayers[team1Id]?.players ?? []).map((player) => ({
        label: player.playerName,
        value: player.playerName,
      }))
    : [];

  const team2PlayerOptions: SelectOption[] = team2Id
    ? (latestTeamPlayers[team2Id]?.players ?? []).map((player) => ({
        label: player.playerName,
        value: player.playerName,
      }))
    : [];

  const fillPlayers = (teamId: string) => {
    const teamData = latestTeamPlayers[teamId];
    if (!teamId || !teamData) {
      return createEmptyPlayers();
    }
    return teamData.players.map((player) => ({
      playerId: player.playerId,
      playerName: player.playerName,
      position: player.position,
      champion: player.champion || "",
    }));
  };

  useEffect(() => {
    setTeam1Players(fillPlayers(team1Id));
  }, [team1Id, latestTeamPlayers, createEmptyPlayers]);

  useEffect(() => {
    setTeam2Players(fillPlayers(team2Id));
  }, [team2Id, latestTeamPlayers, createEmptyPlayers]);

  const handlePlayerNameChange = (
    team: 1 | 2,
    index: number,
    playerName: string
  ) => {
    const setter = team === 1 ? setTeam1Players : setTeam2Players;
    setter((current) => {
      const next = [...current];
      next[index] = { ...next[index], playerName };
      return next;
    });
  };

  const handlePlayerChampionChange = (
    team: 1 | 2,
    index: number,
    champion: string
  ) => {
    const setter = team === 1 ? setTeam1Players : setTeam2Players;
    setter((current) => {
      const next = [...current];
      next[index] = { ...next[index], champion };
      return next;
    });
  };

  const handleBanChange = (team: 1 | 2, index: number, champion: string) => {
    if (team === 1) {
      setTeam1Bans((current) => Object.assign([...current], { [index]: champion }));
    } else {
      setTeam2Bans((current) => Object.assign([...current], { [index]: champion }));
    }
  };

  const handlePredict = async () => {
    if (!team1Id || !team2Id) {
      setError(t("errors.selectBothTeams"));
      return;
    }
    if (team1Id === team2Id) {
      setError(t("errors.selectDifferentTeams"));
      return;
    }

    setError("");
    setLoading(true);
    setPrediction(null);

    try {
      const payload = {
        team1: team1?.name ?? "Team 1",
        team2: team2?.name ?? "Team 2",
        picks_team1: team1Players.map((player) => player.champion || ""),
        picks_team2: team2Players.map((player) => player.champion || ""),
        bans_team1: team1Bans,
        bans_team2: team2Bans,
        players_team1: team1Players.map((player) => player.playerName || ""),
        players_team2: team2Players.map((player) => player.playerName || ""),
        firstPick: 1,
      };
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || t("errors.predictionFailed"));
      } else if (typeof data.prediction !== "number") {
        setError(t("errors.invalidResponse"));
      } else {
        setPrediction({
          prediction: data.prediction,
          probability: Number(data.probability ?? 0),
          threshold: Number(data.threshold ?? 0.5),
        });
      }
    } catch {
      setError(t("errors.apiError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full -mt-6">
      <div className="relative rounded-4xl border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />

        <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-600/30 to-violet-600/20 ring-1 ring-fuchsia-500/30">
            <span className="text-lg" aria-hidden>
              ⚡
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {t("formTitle")}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-400">{t("formSubtitle")}</p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((team) => {
                const selected = team === 1 ? team1Id : team2Id;
                const teamLabel = team === 1 ? t("team1") : t("team2");
                return (
                  <div key={team} className="group rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-6 shadow-xl shadow-black/20 transition hover:border-fuchsia-500/20 hover:shadow-fuchsia-500/5">
                    <h3 className="mb-4 text-xl font-semibold text-white">{teamLabel}</h3>
                    <label className="block text-sm uppercase tracking-[0.12em] text-zinc-400">{t("selectTeamLabel")}</label>
                    <div className="mt-3">
                      <Select
                        instanceId={`team-${team}`}
                        options={teamSelectOptions}
                        value={teamSelectOptions.find((option) => option.value === selected) ?? null}
                        onChange={(option) => {
                          const value = option?.value ?? "";
                          if (team === 1) setTeam1Id(value);
                          else setTeam2Id(value);
                        }}
                        placeholder={t("selectTeamPlaceholder")}
                        isClearable
                        styles={selectStyles}
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    </div>
                    <div className="mt-5 space-y-3 text-sm text-zinc-400">
                      <p>
                        {t("latestRoster")}{" "}
                        <span className="font-semibold text-white">
                          {latestTeamPlayers[selected]?.latestGame
                            ? formatLatestGame(latestTeamPlayers[selected].latestGame, locale)
                            : t("notAvailable")}
                        </span>
                      </p>
                      {selected && team1Id === team2Id && team === 2 ? (
                        <p className="text-rose-300">{t("sameTeamError")}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[{ label: t("team1"), players: team1Players, bans: team1Bans, setBan: (index:number, value:string) => handleBanChange(1,index,value) }, { label: t("team2"), players: team2Players, bans: team2Bans, setBan: (index:number, value:string) => handleBanChange(2,index,value) }].map((side, sideIndex) => (
                <div key={sideIndex} className="rounded-4xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-6 shadow-xl shadow-black/20">
                  <h3 className="mb-4 text-xl font-semibold text-white">{side.label}</h3>

                  <div className="space-y-4">
                    {side.players.map((player, index) => (
                      <div key={`${player.position}-${index}`} className="rounded-3xl bg-zinc-950/90 p-4 ring-1 ring-white/10 transition hover:ring-fuchsia-500/20">
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm uppercase tracking-[0.14em] text-fuchsia-300">{positionLabels[player.position as keyof typeof positionLabels] ?? player.position}</p>
                            <p className="text-base font-semibold text-white">{t("player")}</p>
                          </div>
                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">{t("pick")}</span>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="mb-2 text-sm uppercase tracking-[0.12em] text-zinc-400">{t("player")}</p>
                            <Select
                              instanceId={`player-t${sideIndex + 1}-p${index}`}
                              options={sideIndex === 0 ? team1PlayerOptions : team2PlayerOptions}
                              value={
                                { label: player.playerName, value: player.playerName } as SelectOption
                              }
                              onChange={(option) => handlePlayerNameChange(sideIndex === 0 ? 1 : 2, index, option?.value ?? "")}
                              placeholder={t("selectPlayerPlaceholder")}
                              isClearable
                              styles={selectStyles}
                              className="react-select-container"
                              classNamePrefix="react-select"
                            />
                          </div>
                          <div>
                            <p className="mb-2 text-sm uppercase tracking-[0.12em] text-zinc-400">{t("champion")}</p>
                            <Select
                              instanceId={`champion-t${sideIndex + 1}-p${index}`}
                              options={championSelectOptions}
                              value={
                                player.champion
                                  ? { label: player.champion, value: player.champion }
                                  : null
                              }
                              onChange={(option) => handlePlayerChampionChange(sideIndex === 0 ? 1 : 2, index, option?.value ?? "")}
                              placeholder={t("selectChampionPlaceholder")}
                              isClearable
                              styles={selectStyles}
                              className="react-select-container"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-4xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-6 shadow-xl shadow-black/20">
              <h3 className="mb-4 text-xl font-semibold text-white">{t("bans")}</h3>
              <div className="grid gap-4">
                {[{ label: t("bansTeam1"), bans: team1Bans, setBan: (index:number, value:string) => handleBanChange(1,index,value) }, { label: t("bansTeam2"), bans: team2Bans, setBan: (index:number, value:string) => handleBanChange(2,index,value) }].map((block, blockIndex) => (
                  <div key={blockIndex} className="rounded-3xl bg-zinc-950/90 p-4 ring-1 ring-white/10">
                    <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">{block.label}</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {block.bans.map((ban, banIndex) => (
                        <div key={banIndex}>
                          <Select
                            instanceId={`ban-t${blockIndex + 1}-b${banIndex + 1}`}
                            options={championSelectOptions}
                            value={ban ? { label: ban, value: ban } : null}
                            onChange={(option) => block.setBan(banIndex, option?.value ?? "")}
                            placeholder={t("banPlaceholder", { number: banIndex + 1 })}
                            isClearable
                            styles={selectStyles}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-4xl border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-950/90 via-violet-950/50 to-slate-950/90 p-6 shadow-2xl shadow-fuchsia-500/15">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-2xl" aria-hidden />
              <h3 className="relative text-xl font-semibold text-white">{t("predictionResult")}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{t("predictionHint")}</p>

              <div className="mt-6 space-y-4">
                <button
                  type="button"
                  onClick={handlePredict}
                  disabled={loading}
                  className="inline-flex min-h-[3rem] w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-fuchsia-500/25 transition hover:from-fuchsia-400 hover:to-violet-400 hover:shadow-fuchsia-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? t("calculating") : t("predictButton")}
                </button>

                {error ? (
                  <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                  </div>
                ) : null}

                {prediction ? (
                  <div className="rounded-3xl border border-fuchsia-500/20 bg-white/5 p-5 text-white">
                    <p className="text-sm uppercase tracking-[0.16em] text-fuchsia-300">{t("predictionLabel")}</p>
                    <p className="mt-3 text-3xl font-semibold">
                      {prediction.prediction === 1 ? t("team1Wins") : t("team2Wins")}
                    </p>
                    <p className="mt-2 text-sm text-zinc-300">
                      {t("probability")}{" "}
                      <span className="font-semibold text-white">
                        {(prediction.probability * 100).toFixed(1)}%
                      </span>
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {t("thresholdUsed")} {prediction.threshold}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 text-sm text-zinc-300">
                    {t("predictionPlaceholder")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
