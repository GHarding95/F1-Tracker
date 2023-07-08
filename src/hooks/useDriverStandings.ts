import { useEffect, useState } from 'react';
import { ApiResponse, DriverStanding } from '../card/types';

const apiUrl = 'http://ergast.com/api/f1/current/driverstandings.json';

const useDriverStandings = (): DriverStanding[] => {
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

  return driverStandings;
};

export default useDriverStandings;
