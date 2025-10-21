import React from 'react';
import Card from './card/Card';
import useDriverStandings from './hooks/useDriverStandings';

const App: React.FC = () => {
  const [driverStandings, loading, error] = useDriverStandings();

  const renderCards = () => {
    return (
      <>
        {/* Responsive grid for screens below 1100px */}
        <div className="block xl:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {driverStandings.map((standing, index) => (
              <Card
                key={standing.Driver.driverId}
                driverStanding={standing}
                isFirstDriver={index === 0}
                position={index + 1}
              />
            ))}
          </div>
        </div>

        {/* Original layout for screens 1100px and above */}
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
          })()}
        </div>
      </>
    );
  };

  return (
    <div className='container mx-auto'>
      <div className="driver-card-wrapper">
        <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl mt-7 py-7 heading">
          F1 {new Date().getFullYear()} Drivers Standings
        </h1>

        <h2 className="f1-red text-xl font-semibold mb-4">
          Current season championship points
        </h2>
        
        {loading && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Loading current championship standings...</p>
            <p className="text-xs text-gray-500 mt-1">Fetching official F1 data.</p>
          </div>
        )}

        <div className='bg-gray-100 rounded-lg my-5 p-4 Titillium'>
          <p>Check out this season's official F1 line-up. Full breakdown of drivers, points, and current positions.</p>
        </div>

        {/* Show loading, error, or cards */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-lg">Loading F1 data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              <h2 className="font-bold text-lg mb-2">Unable to Load F1 Data</h2>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          renderCards()  
        )}
      </div>
    </div>
  );
};

export default App;