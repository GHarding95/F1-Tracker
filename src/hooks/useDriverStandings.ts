import { useEffect, useState } from 'react';
import { ApiResponse, DriverStanding } from '../card/types';

const apiUrl = 'https://ergast.com/api/f1/current/driverstandings.json'; 

const useDriverStandings = (): [DriverStanding[], boolean, string | null] => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: ApiResponse = await response.json();

        const standingsLists = data.MRData.StandingsTable.StandingsLists;
        const driverStandings = standingsLists[0].DriverStandings;

        setDriverStandings(driverStandings);
        setLoading(false);
      } catch (err: unknown) {
        setLoading(false);
        if (err instanceof Error) {
          setError('Error: ' + err.message);  
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchData();
  }, []);

  return [driverStandings, loading, error];  
};

export default useDriverStandings;
