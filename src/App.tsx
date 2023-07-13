import React from 'react';
import Card from './card/Card';
import useDriverStandings from './hooks/useDriverStandings';

const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

const App: React.FC = () => {
  const driverStandings = useDriverStandings();
  const currentYear = getCurrentYear();

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
              key={index}
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
        <h1 className="font-bold text-3xl mb-4">F1 {currentYear} Drivers</h1>
        {renderCards()}
      </div>
    </div>
  );
};

export default App;
