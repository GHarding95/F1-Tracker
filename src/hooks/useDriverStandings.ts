import { useEffect, useState } from 'react';
import { ApiResponse, DriverStanding } from '../card/types';

const CURRENT_YEAR = 2025;
const apiUrl = `https://ergast.com/api/f1/${CURRENT_YEAR}/driverstandings.json`;
const fallbackUrl = 'https://ergast.com/api/f1/current/driverstandings.json';

const useDriverStandings = (): [DriverStanding[], boolean, string | null] => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try the 2025 endpoint first
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: ApiResponse = await response.json();

        const standingsLists = data.MRData.StandingsTable.StandingsLists;
        
        // If no standings available for 2025, try the current endpoint
        if (!standingsLists || standingsLists.length === 0) {
          const fallbackResponse = await fetch(fallbackUrl);
          if (!fallbackResponse.ok) {
            throw new Error('Failed to fetch current standings');
          }
          const fallbackData: ApiResponse = await fallbackResponse.json();
          const fallbackStandings = fallbackData.MRData.StandingsTable.StandingsLists;
          
          if (!fallbackStandings || fallbackStandings.length === 0) {
            throw new Error('No standings data available');
          }
          
          setDriverStandings(fallbackStandings[0].DriverStandings);
        } else {
          setDriverStandings(standingsLists[0].DriverStandings);
        }
        
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
