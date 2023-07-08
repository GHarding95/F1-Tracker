import { useEffect, useState } from 'react';
import axios from 'axios';
import { DriverStanding } from '../card/types';

const useFetchDriverStandings = () => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        const response = await axios.get(
          'http://ergast.com/api/f1/current/driverStandings.json'
        );
        const standingsData = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        setDriverStandings(standingsData);
      } catch (error) {
        console.error('Error fetching driver standings:', error);
        setError(true);
      }
    };

    fetchDriverStandings();
  }, []);

  return { driverStandings, error };
};

export default useFetchDriverStandings;
