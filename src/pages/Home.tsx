import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../card/Card';
import LandingSplash from '../components/LandingSplash';
import useDriverStandings from '../hooks/useDriverStandings';

const MIN_SPLASH_MS = 1650;

const Home: React.FC = () => {
  const [driverStandings, loading, error] = useDriverStandings();
  const [splashActive, setSplashActive] = useState(true);
  const [splashMounted, setSplashMounted] = useState(true);
  const mountTimeRef = useRef(Date.now());

  useEffect(() => {
    if (loading) return;
    const elapsed = Date.now() - mountTimeRef.current;
    const wait = Math.max(0, MIN_SPLASH_MS - elapsed);
    const t = window.setTimeout(() => setSplashActive(false), wait);
    return () => window.clearTimeout(t);
  }, [loading]);

  const renderCards = () => {
    return (
      <>
        <div className="block xl:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {driverStandings.map((standing, index) => (
              <Link
                key={standing.Driver.driverId}
                to={`/race-results/${encodeURIComponent(standing.Driver.driverId)}`}
                state={{
                  givenName: standing.Driver.givenName,
                  familyName: standing.Driver.familyName
                }}
                className="driver-card-link"
              >
                <Card driverStanding={standing} position={index + 1} />
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden xl:block">
          {(() => {
            const rows: JSX.Element[] = [];
            const numDrivers = driverStandings.length;
            const numColumns = 4;
            const numRows = Math.ceil(numDrivers / numColumns);

            for (let i = 0; i < numRows; i++) {
              const start = i === 0 ? 0 : (i - 1) * numColumns + 3;
              const end = i === 0 ? 3 : i * numColumns + 3;
              const rowDrivers = driverStandings.slice(start, end);

              rows.push(
                <div className="flex justify-evenly mb-4" key={i}>
                  {rowDrivers.map((standing, index) => (
                    <Link
                      key={standing.Driver.driverId}
                      to={`/race-results/${encodeURIComponent(standing.Driver.driverId)}`}
                      state={{
                        givenName: standing.Driver.givenName,
                        familyName: standing.Driver.familyName
                      }}
                      className="driver-card-link"
                    >
                      <Card driverStanding={standing} position={start + index + 1} />
                    </Link>
                  ))}
                </div>
              );
            }

            return rows;
          })()}
        </div>
      </>
    );
  };

  return (
    <>
      {splashMounted && (
        <LandingSplash active={splashActive} onExited={() => setSplashMounted(false)} />
      )}
      <div className="container mx-auto flex-1">
        <div className="driver-card-wrapper flex-1">
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl mt-7 py-7 heading pl-0 pr-4 sm:pr-6">
            F1 {new Date().getFullYear()} Drivers Standings
          </h1>

          <h2 className="f1-red text-xl font-semibold mb-4 px-1">
            Current season championship points
          </h2>

          <div className="rounded-lg my-5 p-4 sm:p-5 Titillium intro-panel">
            <p>Check out this season&apos;s official F1 line-up. Full breakdown of drivers, points, and current positions.</p>
          </div>

          {loading ? (
            <div className="text-center py-12 loading-panel">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 spinner-f1" />
              <p className="mt-5 text-sm">Loading current championship standings...</p>
              <p className="text-xs mt-2 opacity-80">Fetching official F1 data.</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="error-panel px-5 py-5 rounded-xl max-w-md mx-auto text-left sm:text-center">
                <h2 className="font-bold text-lg mb-2">Unable to Load F1 Data</h2>
                <p className="text-sm opacity-95">{error}</p>
                <button type="button" onClick={() => window.location.reload()} className="mt-4 btn-retry">
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            renderCards()
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
