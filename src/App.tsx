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
    <div>
      <h1>F1 {currentYear} Drivers</h1>      
      {driverStandings.map((standing, index) => (
        <Card
          key={index}
          driverStanding={standing}
          isFirstDriver={index === 0}
        />
      ))}
    </div>
  );
};

export default App;
