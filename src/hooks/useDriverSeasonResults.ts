import { useEffect, useRef, useState } from 'react';
import { getFlagForNationality } from '../utils/nationalityFlag';

const F1_API_BASE = 'https://f1api.dev/api';

export type DriverSeasonRaceRow = {
  round: number;
  grandPrix: string;
  dateDisplay: string;
  team: string;
  /** Constructor `teamId` from the API (for header badge; same id as main-page cards). */
  teamId: string;
  racePosition: string;
  pointsTotal: number;
  racePoints: number;
  sprintPosition: string | null;
  sprintPoints: number | null;
  grid: string;
  raceTime: string | null;
  fastLap: string | null;
  retired: string | null;
};

export type DriverSeasonMeta = {
  season: number;
  driverDisplayName: string | null;
  driverNationality: string | null;
  driverFlag: string | null;
  constructorId: string | null;
  constructorTeamName: string | null;
};

type CalendarRace = {
  round: number;
  schedule?: {
    race?: { date?: string | null };
    sprintRace?: { date?: string | null };
  };
  circuit?: { country?: string } | Array<{ country?: string }>;
};

function circuitCountry(cal: CalendarRace): string {
  const c = cal.circuit;
  if (!c) return '';
  if (Array.isArray(c)) return c[0]?.country ?? '';
  return c.country ?? '';
}

function formatRaceDay(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(d);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

async function mapInChunks<T, R>(
  items: T[],
  chunkSize: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    out.push(...(await Promise.all(chunk.map(fn))));
  }
  return out;
}

type RaceApiResult = {
  position?: string | number;
  points?: number;
  grid?: string | number;
  time?: string | null;
  fastLap?: string | null;
  retired?: string | null;
  driver?: { driverId?: string; name?: string; surname?: string; nationality?: string };
  team?: { teamName?: string; teamId?: string };
};

type SprintApiRow = {
  driverId?: string;
  position?: number;
  points?: number;
};

function normalizeCircuitFromRacePayload(
  circuit: { country?: string } | Array<{ country?: string }> | undefined,
  fallbackGrandPrix: string
): string {
  if (!circuit) return fallbackGrandPrix;
  if (Array.isArray(circuit)) return circuit[0]?.country ?? fallbackGrandPrix;
  return circuit.country ?? fallbackGrandPrix;
}

type ChampionshipRow = {
  driverId?: string;
  teamId?: string;
  driver?: { name?: string; surname?: string; nationality?: string };
  team?: { teamId?: string; teamName?: string };
};

const useDriverSeasonResults = (
  driverId: string | undefined
): [DriverSeasonRaceRow[], boolean, string | null, DriverSeasonMeta] => {
  const [rows, setRows] = useState<DriverSeasonRaceRow[]>([]);
  const [loading, setLoading] = useState(Boolean(driverId));
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<DriverSeasonMeta>({
    season: new Date().getFullYear(),
    driverDisplayName: null,
    driverNationality: null,
    driverFlag: null,
    constructorId: null,
    constructorTeamName: null,
  });
  const racesHeaderSealedRef = useRef(false);

  useEffect(() => {
    if (!driverId) {
      setRows([]);
      setLoading(false);
      setError(null);
      racesHeaderSealedRef.current = false;
      setMeta({
        season: new Date().getFullYear(),
        driverDisplayName: null,
        driverNationality: null,
        driverFlag: null,
        constructorId: null,
        constructorTeamName: null,
      });
      return;
    }

    let cancelled = false;
    racesHeaderSealedRef.current = false;

    setLoading(true);
    setError(null);
    setRows([]);
    setMeta({
      season: new Date().getFullYear(),
      driverDisplayName: null,
      driverNationality: null,
      driverFlag: null,
      constructorId: null,
      constructorTeamName: null,
    });

    const applyStandingsHeader = async (): Promise<void> => {
      try {
        const res = await fetch(`${F1_API_BASE}/current/drivers-championship`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const list: ChampionshipRow[] = Array.isArray(data.drivers_championship)
          ? data.drivers_championship
          : [];
        const row = list.find((d) => d.driverId === driverId);
        if (!row || cancelled) return;

        const nat = row.driver?.nationality;
        const label =
          [row.driver?.name, row.driver?.surname].filter(Boolean).join(' ').trim() || null;
        const tid = row.teamId || row.team?.teamId || '';
        const tname = row.team?.teamName ?? null;
        const apiSeason = Number(data.season);

        setMeta((m) => {
          if (racesHeaderSealedRef.current) return m;
          return {
            ...m,
            season: apiSeason > 0 ? apiSeason : m.season,
            driverDisplayName: label ?? m.driverDisplayName,
            driverNationality: nat ?? m.driverNationality,
            driverFlag: nat ? getFlagForNationality(nat) : m.driverFlag,
            constructorId: tid ? tid : m.constructorId,
            constructorTeamName: tname ?? m.constructorTeamName,
          };
        });
      } catch {
        /* optional: race fetch still drives the page */
      }
    };

    const loadRaces = async (): Promise<void> => {
      try {
        const calRes = await fetch(`${F1_API_BASE}/current`);
        if (!calRes.ok) {
          throw new Error(`Calendar request failed (${calRes.status})`);
        }
        const calJson = await calRes.json();
        const season = Number(calJson.season);
        const races: CalendarRace[] = Array.isArray(calJson.races) ? calJson.races : [];
        const today = todayIso();

        const due = races
          .filter((r) => r.round != null && r.schedule?.race?.date && r.schedule.race.date <= today)
          .sort((a, b) => a.round - b.round);

        let driverDisplayName: string | null = null;
        const headerAcc = { driverNationality: null as string | null };

        const buildRow = async (calRace: CalendarRace): Promise<DriverSeasonRaceRow | null> => {
          const round = calRace.round;
          const raceRes = await fetch(`${F1_API_BASE}/${season}/${round}/race`);
          if (!raceRes.ok) {
            return null;
          }
          const raceJson = await raceRes.json();
          const block = raceJson.races;
          if (!block?.results || !Array.isArray(block.results)) {
            return null;
          }

          const found = (block.results as RaceApiResult[]).find(
            (r) => r.driver?.driverId === driverId
          );
          if (!found) {
            return null;
          }

          if (!driverDisplayName && found.driver) {
            const label = [found.driver.name, found.driver.surname].filter(Boolean).join(' ').trim();
            if (label) driverDisplayName = label;
          }
          if (!headerAcc.driverNationality && found.driver?.nationality) {
            headerAcc.driverNationality = found.driver.nationality;
          }

          const grandPrix = normalizeCircuitFromRacePayload(
            block.circuit,
            circuitCountry(calRace) || `Round ${round}`
          );
          const dateIso = typeof block.date === 'string' ? block.date : calRace.schedule?.race?.date ?? '';
          const dateDisplay = dateIso ? formatRaceDay(dateIso) : '—';

          let sprintPosition: string | null = null;
          let sprintPoints: number | null = null;

          const sprintScheduled = Boolean(calRace.schedule?.sprintRace?.date);
          if (sprintScheduled) {
            const sprintRes = await fetch(`${F1_API_BASE}/${season}/${round}/sprint/race`);
            if (sprintRes.ok) {
              const sprintJson = await sprintRes.json();
              const list: SprintApiRow[] =
                sprintJson.races?.sprintRaceResults ?? sprintJson.races?.sprint_race_results ?? [];
              const sp = list.find((s) => s.driverId === driverId);
              if (sp) {
                sprintPosition = String(sp.position ?? '—');
                sprintPoints = typeof sp.points === 'number' ? sp.points : Number(sp.points) || 0;
              }
            }
          }

          const racePoints = typeof found.points === 'number' ? found.points : Number(found.points) || 0;
          const extra = sprintPoints ?? 0;
          const pointsTotal = racePoints + extra;

          return {
            round,
            grandPrix,
            dateDisplay,
            team: found.team?.teamName ?? '—',
            teamId: found.team?.teamId ?? '',
            racePosition: String(found.position ?? '—'),
            pointsTotal,
            racePoints,
            sprintPosition,
            sprintPoints: sprintPoints !== null ? sprintPoints : null,
            grid: String(found.grid ?? '—'),
            raceTime: found.time ?? null,
            fastLap: found.fastLap ?? null,
            retired: found.retired ?? null
          };
        };

        const built = await mapInChunks(due, 4, buildRow);
        const filtered = built.filter((r): r is DriverSeasonRaceRow => r != null);
        const lastRow = filtered[filtered.length - 1];
        const nat = headerAcc.driverNationality;

        if (!cancelled) {
          racesHeaderSealedRef.current = true;
          setMeta((m) => ({
            ...m,
            season,
            driverDisplayName: driverDisplayName ?? m.driverDisplayName,
            driverNationality: nat ?? m.driverNationality,
            driverFlag: nat ? getFlagForNationality(nat) : m.driverFlag,
            constructorId: lastRow?.teamId ? lastRow.teamId : m.constructorId,
            constructorTeamName:
              lastRow?.team && lastRow.team !== '—' ? lastRow.team : m.constructorTeamName,
          }));
          setRows(filtered);
          setLoading(false);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setLoading(false);
          setError(e instanceof Error ? e.message : 'Failed to load race results');
        }
      }
    };

    void applyStandingsHeader();
    void loadRaces();

    return () => {
      cancelled = true;
    };
  }, [driverId]);

  return [rows, loading, error, meta];
};

export default useDriverSeasonResults;
