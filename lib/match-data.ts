import fs from "fs/promises";
import path from "path";

export type TeamOption = {
  id: string;
  name: string;
};

export type PlayerInfo = {
  playerId: string;
  playerName: string;
  position: string;
  champion: string;
  teamId: string;
  teamName: string;
};

export type TeamPlayerData = {
  teamId: string;
  teamName: string;
  latestGame: string;
  players: PlayerInfo[];
};

const positionOrder = ["top", "jng", "mid", "bot", "sup"];

function normalize(value: string | undefined) {
  return (value ?? "").trim();
}

function parseCsv(text: string) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.length > 0);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((key, index) => {
      row[key] = values[index] ?? "";
    });
    return row;
  });
}

export async function getInitialMatchData() {
  const csvPath = path.join(
    process.cwd(),
    "public",
    "2026_LoL_esports_match_data_from_OraclesElixir.csv"
  );
  const csv = await fs.readFile(csvPath, "utf8");
  const rows = parseCsv(csv);

  const teamRows = new Map<string, { teamName: string; date: number }>();
  const teamGameMap = new Map<
    string,
    Map<string, { date: number; rows: Record<string, string>[] }>
  >();
  const championSet = new Set<string>();
  const playerSet = new Set<string>();

  rows.forEach((row) => {
    const teamId = normalize(row.teamid);
    const teamName = normalize(row.teamname);
    const date = new Date(normalize(row.date)).getTime();
    const participantId = normalize(row.participantid);
    const champion = normalize(row.champion);
    const playerName = normalize(row.playername);

    if (teamId) {
      const current = teamRows.get(teamId);
      if (!current || date > current.date) {
        teamRows.set(teamId, { teamName, date });
      }
    }

    [champion, row.ban1, row.ban2, row.ban3, row.ban4, row.ban5, row.pick1, row.pick2, row.pick3, row.pick4, row.pick5].forEach((value) => {
      const normalized = normalize(value);
      if (normalized) championSet.add(normalized);
    });

    if (playerName) playerSet.add(playerName);

    const numericParticipant = Number(participantId);
    if (!Number.isNaN(numericParticipant) && numericParticipant >= 1 && numericParticipant <= 10 && teamId) {
      const gameId = normalize(row.gameid);
      if (!gameId) return;
      const teamGames = teamGameMap.get(teamId) ?? new Map();
      const gameGroup = teamGames.get(gameId) ?? { date, rows: [] };
      gameGroup.rows.push(row);
      if (date > gameGroup.date) gameGroup.date = date;
      teamGames.set(gameId, gameGroup);
      teamGameMap.set(teamId, teamGames);
    }
  });

  const teamPlayers: Record<string, TeamPlayerData> = {};

  teamGameMap.forEach((games, teamId) => {
    let latestGameId: string | null = null;
    let latestTimestamp = 0;
    games.forEach((game, gameId) => {
      if (game.date > latestTimestamp) {
        latestTimestamp = game.date;
        latestGameId = gameId;
      }
    });
    if (!latestGameId) return;
    const game = games.get(latestGameId);
    if (!game) return;
    const rows = game.rows.filter((row) => normalize(row.teamid) === teamId);
    const sortedPlayers = rows
      .map((row) => ({
        playerId: normalize(row.playerid),
        playerName: normalize(row.playername),
        position: normalize(row.position),
        champion: normalize(row.champion),
        teamId,
        teamName: normalize(row.teamname),
      }))
      .sort((a, b) => {
        const indexA = positionOrder.indexOf(a.position.toLowerCase());
        const indexB = positionOrder.indexOf(b.position.toLowerCase());
        return indexA - indexB;
      });

    const teamName = teamRows.get(teamId)?.teamName ?? sortedPlayers[0]?.teamName ?? "Equipo";
    const latestDate = latestTimestamp ? new Date(latestTimestamp).toISOString() : "";

    teamPlayers[teamId] = {
      teamId,
      teamName,
      latestGame: latestDate,
      players: sortedPlayers,
    };
  });

  const teamOptions = [...teamRows.entries()]
    .map(([id, info]) => ({ id, name: info.teamName }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const championOptions = [...championSet].sort((a, b) => a.localeCompare(b));
  const playerOptions = [...playerSet].sort((a, b) => a.localeCompare(b));

  return {
    teamOptions,
    championOptions,
    teamPlayers,
    playerOptions,
  };
}
