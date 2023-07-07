import React from 'react';
import DriverCard from './card/DriverCard';
import useFetchDriverStandings from './hooks/useFetchDriverStanding';

const App: React.FC = () => {
  const { driverStandings, error } = useFetchDriverStandings();

  return (
    <div>
      <h1>F1 Drivers 2023</h1>
      {error ? (
        <h3>Error fetching driver standings</h3>
      ) : (
        <div className="driver-cards-container">
          {driverStandings.map((standing) => (
            <DriverCard key={standing.Driver.driverId} driverStanding={standing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
