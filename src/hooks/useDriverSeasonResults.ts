import { useEffect, useRef, useState } from 'react';
import { F1_API_BASE, f1FetchJson } from '../api/f1Client';
import { getFlagForNationality } from '../utils/nationalityFlag';

/** Parallel race fetches per wave (balance: latency vs. API / browser limits). */
const RACE_FETCH_CONCURRENCY = 8;

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

/** e.g. 1 / "1" / "P1" → "P1" so Race and Sprint columns match */
function formatFinishPosition(raw: string): string {
  const s = raw.trim();
  if (s === '' || s === '—') return '—';
  const m = /^P?(\d+)$/i.exec(s);
  if (m) return `P${m[1]}`;
  return s;
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
  position?: number | string;
  points?: number;
};

type RaceResultPayload = {
  races?: {
    results?: RaceApiResult[];
    circuit?: { country?: string } | Array<{ country?: string }>;
    date?: string;
  };
};

type SprintRacePayload = {
  races?: {
    sprintRaceResults?: SprintApiRow[];
    sprint_race_results?: SprintApiRow[];
  };
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
        if (cancelled) return;
        const data = await f1FetchJson<{
          season?: number;
          drivers_championship?: ChampionshipRow[];
        }>(`${F1_API_BASE}/current/drivers-championship`);
        if (cancelled) return;
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
        const calJson = await f1FetchJson<{ season?: number; races?: CalendarRace[] }>(
          `${F1_API_BASE}/current`
        );
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
          let raceJson: RaceResultPayload;
          try {
            raceJson = await f1FetchJson<RaceResultPayload>(
              `${F1_API_BASE}/${season}/${round}/race`
            );
          } catch {
            return null;
          }
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
            try {
              const sprintJson = await f1FetchJson<SprintRacePayload>(
                `${F1_API_BASE}/${season}/${round}/sprint/race`
              );
              const list: SprintApiRow[] =
                sprintJson.races?.sprintRaceResults ?? sprintJson.races?.sprint_race_results ?? [];
              const sp = list.find((s) => s.driverId === driverId);
              if (sp) {
                sprintPosition = formatFinishPosition(String(sp.position ?? '—'));
                sprintPoints = typeof sp.points === 'number' ? sp.points : Number(sp.points) || 0;
              }
            } catch {
              /* sprint optional */
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
            racePosition: formatFinishPosition(String(found.position ?? '—')),
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

        const accumulated: DriverSeasonRaceRow[] = [];
        for (let i = 0; i < due.length; i += RACE_FETCH_CONCURRENCY) {
          if (cancelled) return;
          const chunk = due.slice(i, i + RACE_FETCH_CONCURRENCY);
          const results = await Promise.all(chunk.map(buildRow));
          for (const r of results) {
            if (r != null) accumulated.push(r);
          }
          accumulated.sort((a, b) => a.round - b.round);
          if (!cancelled && accumulated.length > 0) {
            setRows([...accumulated]);
            setLoading(false);
          }
        }

        const filtered = accumulated;
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
          setRows([...filtered]);
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
