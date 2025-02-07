import { useEffect, useState } from 'react';
import { ApiResponse, DriverStanding } from '../card/types';

const apiUrl = 'http://ergast.com/api/f1/current/driverstandings.json';

const useDriverStandings = (): [DriverStanding[], boolean, string] => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);  // Start loading
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data: ApiResponse = await response.json();
        const standingsLists = data.MRData.StandingsTable.StandingsLists;
        const driverStandings = standingsLists[0].DriverStandings;

        setDriverStandings(driverStandings);
      } catch (error: any) {
        setError(error.message || 'Error fetching data');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  return [driverStandings, loading, error];
};

export default useDriverStandings;
