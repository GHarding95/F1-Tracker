import React, { useEffect, useState } from 'react';

const apiUrl = 'http://ergast.com/api/f1/current/driverstandings.json';

type Driver = {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
};

type Constructor = {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
};

type DriverStanding = {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
};

type StandingsList = {
  season: string;
  round: string;
  DriverStandings: DriverStanding[];
};

type ApiResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: StandingsList[];
    };
  };
};

const App: React.FC = () => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data: ApiResponse = await response.json();

        const standingsLists = data.MRData.StandingsTable.StandingsLists;
        const driverStandings = standingsLists[0].DriverStandings;

        setDriverStandings(driverStandings);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>F1 Drivers 2023</h1>
      <ul>
        {driverStandings.map((standing, index) => (
          <li key={index}>
            <h2>
              {standing.Driver.givenName} {standing.Driver.familyName}
            </h2>
            <p>Points: {standing.points}</p>
            <p>Nationality: {standing.Driver.nationality}</p>
            <p>Team: {standing.Constructors[0].name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
