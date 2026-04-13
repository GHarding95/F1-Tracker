import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ConstructorLogo from '../components/ConstructorLogo';
import DriverFlag from '../components/DriverFlag';
import useDriverSeasonResults from '../hooks/useDriverSeasonResults';

type LocationState = {
  givenName?: string;
  familyName?: string;
  nationality?: string;
  flag?: string;
  constructorId?: string;
  teamName?: string;
};

const RaceResults: React.FC = () => {
  const { driverId: rawId } = useParams<{ driverId: string }>();
  const driverId = rawId ? decodeURIComponent(rawId) : undefined;
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [rows, loading, err, meta] = useDriverSeasonResults(driverId);

  const fromNav = [state?.givenName, state?.familyName].filter(Boolean).join(' ').trim();
  const driverTitle = fromNav || meta.driverDisplayName || driverId || 'Driver';
  const seasonYear = meta.season > 0 ? meta.season : new Date().getFullYear();

  const headerFlag = meta.driverFlag ?? state?.flag ?? null;
  const headerNationality = meta.driverNationality ?? state?.nationality ?? '';
  const headerConstructorId = meta.constructorId ?? state?.constructorId ?? null;
  const headerConstructorTeamName = meta.constructorTeamName ?? state?.teamName ?? null;

  const pointsTitle = (row: (typeof rows)[0]): string => {
    if (row.sprintPoints != null && row.sprintPoints > 0) {
      return `Race ${row.racePoints} + sprint ${row.sprintPoints}`;
    }
    return `Race points: ${row.racePoints}`;
  };

  return (
    <div className="container mx-auto flex-1">
      <div className="driver-card-wrapper flex-1">
        <nav className="mb-6 px-1">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.1)] bg-transparent px-2.5 py-1.5 text-sm font-normal Titillium text-[var(--f1-muted)] no-underline transition-colors duration-200 hover:border-[rgba(225,6,0,0.35)] hover:bg-[rgba(225,6,0,0.06)] hover:text-[var(--f1-white)] hover:decoration-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--f1-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--f1-bg-deep)]"
          >
            <span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-[var(--f1-muted)] transition-colors group-hover:text-[var(--f1-red)]"
              aria-hidden
            >
              <svg
                className="block"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9 7 4 12l5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="tracking-wide">Back to standings</span>
          </Link>
        </nav>

        <div className="mt-2 py-4 pl-0 pr-4 sm:pr-6 heading heading--no-shadow flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl F1-Bold flex-1 min-w-0">
            {driverTitle}
          </h1>
          {(headerFlag || headerConstructorId) && (
            <div className="flex items-center shrink-0 gap-3 [&>div]:ml-0 self-start sm:self-center">
              {headerFlag && headerNationality && (
                <DriverFlag flag={headerFlag} nationality={headerNationality} />
              )}
              {headerConstructorId != null && headerConstructorTeamName != null && (
                <ConstructorLogo
                  constructorId={headerConstructorId}
                  teamName={headerConstructorTeamName}
                />
              )}
            </div>
          )}
        </div>
        <h2 className="f1-red text-lg sm:text-xl font-semibold mb-6 px-1 Titillium">
          {seasonYear} race results
        </h2>

        {loading ? (
          <div className="text-center py-16 loading-panel">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 spinner-f1" />
            <p className="mt-5 text-base">Loading race results</p>
          </div>
        ) : err ? (
          <div className="error-panel px-5 py-5 rounded-xl max-w-lg">
            <h2 className="font-bold text-lg mb-2">Could not load results</h2>
            <p className="text-sm opacity-95">{err}</p>
            <Link to="/" className="inline-block mt-4 text-sm">
              Return to standings
            </Link>
          </div>
        ) : rows.length === 0 ? (
          <div className="intro-panel p-5 max-w-lg Titillium">
            <p className="text-sm leading-relaxed">
              No finished races found for this driver yet, or they have not appeared in a race
              result. Completed rounds are detected from the official calendar; sprint points are
              included in the total when available from the API.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--f1-border)] bg-[rgba(12,12,18,0.6)] shadow-lg">
            <table className="min-w-[680px] w-full text-left text-base Titillium border-collapse">
              <thead>
                <tr className="border-b border-[var(--f1-border)] bg-[rgba(255,255,255,0.03)]">
                  <th scope="col" className="py-4 px-3 sm:px-5 text-base font-semibold text-[var(--f1-muted)]">
                    Grand Prix
                  </th>
                  <th scope="col" className="py-4 px-3 sm:px-5 text-base font-semibold text-[var(--f1-muted)]">
                    Date
                  </th>
                  <th scope="col" className="py-4 px-3 sm:px-5 text-base font-semibold text-[var(--f1-muted)]">
                    Team
                  </th>
                  <th
                    scope="col"
                    className="py-4 px-3 sm:px-5 text-base font-semibold text-[var(--f1-muted)] text-right hidden md:table-cell"
                  >
                    Sprint
                  </th>
                  <th
                    scope="col"
                    className="py-4 px-3 sm:px-5 text-base font-semibold text-[var(--f1-muted)] text-right"
                  >
                    Race
                  </th>
                  <th
                    scope="col"
                    className="py-4 px-3 sm:px-5 text-base font-semibold text-[var(--f1-muted)] text-right hidden lg:table-cell"
                  >
                    Race time
                  </th>
                  <th
                    scope="col"
                    className="py-4 px-3 sm:px-5 text-base font-semibold text-[var(--f1-muted)] text-right hidden xl:table-cell"
                  >
                    Fast lap
                  </th>
                  <th
                    scope="col"
                    className="py-4 px-3 sm:px-5 text-base font-semibold text-[var(--f1-muted)] text-right"
                  >
                    Pts.
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.round}
                    className="border-b border-[var(--f1-border)] last:border-0 hover:bg-[rgba(225,6,0,0.06)]"
                  >
                    <td className="py-4 px-3 sm:px-5 text-base font-medium text-[var(--f1-white)]">
                      {row.grandPrix}
                    </td>
                    <td className="py-4 px-3 sm:px-5 text-base text-[var(--f1-muted)] whitespace-nowrap">
                      {row.dateDisplay}
                    </td>
                    <td className="py-4 px-3 sm:px-5 text-base text-[var(--f1-muted)] max-w-[220px] truncate">
                      {row.team}
                    </td>
                    <td className="py-4 px-3 sm:px-5 text-base text-right font-variant-numeric tabular-nums hidden md:table-cell text-[var(--f1-muted)]">
                      {row.sprintPosition != null ? (
                        <span title={`Sprint points: ${row.sprintPoints ?? 0}`}>
                          {row.sprintPosition}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td
                      className="py-4 px-3 sm:px-5 text-base text-right font-variant-numeric tabular-nums"
                      title={row.retired || undefined}
                    >
                      {row.retired ? `RET (${row.racePosition})` : row.racePosition}
                    </td>
                    <td className="py-4 px-3 sm:px-5 text-right font-mono text-base hidden lg:table-cell text-[var(--f1-muted)] max-w-[140px] truncate">
                      {row.raceTime ?? '—'}
                    </td>
                    <td className="py-4 px-3 sm:px-5 text-right font-mono text-base hidden xl:table-cell text-[var(--f1-muted)]">
                      {row.fastLap ?? '—'}
                    </td>
                    <td
                      className="py-4 px-3 sm:px-5 text-base text-right font-variant-numeric tabular-nums font-semibold"
                      title={pointsTitle(row)}
                    >
                      {row.pointsTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaceResults;
