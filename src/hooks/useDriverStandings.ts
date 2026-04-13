import { useEffect, useState } from 'react';
import { DriverStanding } from '../card/types';
import { getFlagForNationality } from '../utils/nationalityFlag';

// F1 API - Direct championship standings endpoint
const F1_API_BASE_URL = 'https://f1api.dev/api';

// API URLs
const getChampionshipStandingsUrl = () => `${F1_API_BASE_URL}/current/drivers-championship`;

const useDriverStandings = (): [DriverStanding[], boolean, string | null] => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        console.log('Fetching championship standings from F1 API...');
        
        // Simple API call to get championship standings
        const response = await fetch(getChampionshipStandingsUrl());
        
        if (!response.ok) {
          throw new Error(`Failed to fetch championship standings: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.drivers_championship || data.drivers_championship.length === 0) {
          throw new Error('No championship data available');
        }
        
        console.log(`Found ${data.drivers_championship.length} drivers in championship standings`);
        
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

        console.log('Converted', convertedStandings.length, 'championship standings');
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
