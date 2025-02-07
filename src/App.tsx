import React, { useState, useEffect } from 'react';
import Card from './card/Card';
import useDriverStandings from './hooks/useDriverStandings';

const App: React.FC = () => {
  const [driverStandings, loading, error] = useDriverStandings(); 
  const [isLoading, setIsLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

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

        {/* Show loading, error, or cards */}
        {isLoading ? (
          <h1>Loading...</h1>
        ) : error ? (
          <h1>{error}</h1>  
        ) : (
          renderCards()  
        )}
      </div>
    </div>
  );
};

export default App;