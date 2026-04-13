import { useEffect, useState } from 'react';
import { F1_API_BASE, f1FetchJson } from '../api/f1Client';
import { DriverStanding } from '../card/types';
import { getFlagForNationality } from '../utils/nationalityFlag';

const useDriverStandings = (): [DriverStanding[], boolean, string | null] => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data = await f1FetchJson<{ drivers_championship?: unknown[] }>(
          `${F1_API_BASE}/current/drivers-championship`
        );

        if (!data || !data.drivers_championship || data.drivers_championship.length === 0) {
          throw new Error('No championship data available');
        }
        
        // Convert F1 API format to our format
        const convertedStandings = data.drivers_championship.map((driver: any) => ({
          position: String(driver.position),
          positionText: String(driver.position),
          points: String(driver.points),
          wins: String(driver.wins || '0'),
          Driver: {
            driverId: driver.driverId || `driver_${driver.position}`,
            permanentNumber: String(driver.driver?.number || ''),
            code: driver.driver?.shortName || '',
            url: driver.driver?.url || '',
            givenName: driver.driver?.name || 'Unknown',
            familyName: driver.driver?.surname || 'Driver',
            nationality: driver.driver?.nationality || 'Unknown',
            dateOfBirth: driver.driver?.birthday || '',
            flag: getFlagForNationality(driver.driver?.nationality || 'Unknown')
          },
          Constructors: [{
            constructorId: driver.teamId || `team_${driver.position}`,
            url: driver.team?.url || '',
            name: driver.team?.teamName || 'Unknown Team',
            nationality: driver.team?.country || 'Unknown'
          }]
        }));

        setDriverStandings(convertedStandings);
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
