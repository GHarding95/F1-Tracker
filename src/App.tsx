import React, { useState, useEffect } from 'react';
import Card from './card/Card';
import useDriverStandings from './hooks/useDriverStandings';

const App: React.FC = () => {
  const [driverStandings, loading, error] = useDriverStandings();  // Get loading and error from hook
  const [isLoading, setIsLoading] = useState(true);  // General loading state for the page
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Update isLoading based on the fetched driverStandings data or network issues
    if (driverStandings.length > 0 || loading) {
      setIsLoading(false);
    } else {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);  // Wait for 5 seconds before hiding the loading screen

      return () => clearTimeout(timeout);
    }
  }, [driverStandings, loading]);

  const isOffSeason = (): boolean => {
    const month = new Date().getMonth() + 1;
    return month === 1 || month === 2; // January & February are off-season
  };

  const renderCards = () => {
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
            <Card
              key={standing.Driver.driverId}
              driverStanding={standing}
              isFirstDriver={index === 0 && i === 0}
              position={start + index + 1}
            />
          ))}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className='container mx-auto'>
      <div className="driver-card-wrapper">
        <h1 className="font-bold text-6xl mt-7 py-7 heading">
          F1 {currentYear} Drivers
        </h1>

        {/* Display a subtitle only in the off-season */}
        {isOffSeason() && (
          <h2 className="f1-red text-xl font-semibold">
            Displaying last season's final standings (New season starts in March)
          </h2>
        )}

        <div className='bg-gray-100 rounded-lg my-5 p-4 Titillium'>
          <p>Check out this season's official F1 line-up. Full breakdown of drivers, points, and current positions.</p>
          <p>Follow your favourite F1 drivers on and off the track.</p>
        </div>

        {/* Show a general loading screen while waiting for the page to load */}
        {isLoading ? (
          <h1>Loading...</h1>  // Show loading if the page or API takes too long to load
        ) : error ? (
          <h1>Error: {error}</h1>  // Show error if data fetching failed
        ) : (
          renderCards()
        )}
      </div>
    </div>
  );
};

export default App;
