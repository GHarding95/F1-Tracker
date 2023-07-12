import React from 'react';
import Card from './card/Card';
import useDriverStandings from './hooks/useDriverStandings';

const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

const App: React.FC = () => {
  const driverStandings = useDriverStandings();
  const currentYear = getCurrentYear();

  return (
    <>
    <div className='driver-card-wrapper'>
      <h1>F1 {currentYear} Drivers</h1>      
      {driverStandings.map((standing, index) => (
        <Card
          key={index}
          driverStanding={standing}
          isFirstDriver={index === 0}
          position={index + 1}
        />
      ))}
  </div>
    </>
  );
};

export default App;
