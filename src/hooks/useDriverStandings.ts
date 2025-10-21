import { useEffect, useState } from 'react';
import { DriverStanding } from '../card/types';

// F1 API - Direct championship standings endpoint
const F1_API_BASE_URL = 'https://f1api.dev/api';

// API URLs
const getChampionshipStandingsUrl = () => `${F1_API_BASE_URL}/current/drivers-championship`;

// Flag mapping for driver nationalities
const getFlagForNationality = (nationality: string): string => {
  const flagMap: { [key: string]: string } = {
    'Australia': '/assets/flags/flagAustralian.jpg',
    'Great Britain': '/assets/flags/flagBritish.jpg',
    'United Kingdom': '/assets/flags/flagBritish.jpg',
    'Netherlands': '/assets/flags/flagDutch.jpg',
    'Spain': '/assets/flags/flagSpanish.png',
    'Monaco': '/assets/flags/flagMonaco.png',
    'Canada': '/assets/flags/flagCanadian.jpg',
    'Denmark': '/assets/flags/flagDanish.jpg',
    'Japan': '/assets/flags/flagJapan.jpg',
    'Thailand': '/assets/flags/flagThai.jpg',
    'Germany': '/assets/flags/flagGerman.jpg',
    'New Zealand': '/assets/flags/flagAustralian.jpg', // Using Australian flag as fallback
    'Argentina': '/assets/flags/flagSpanish.png', // Using Spanish flag as fallback
    'Finland': '/assets/flags/flagFinnish.jpg',
    'China': '/assets/flags/flagChina.jpg',
    'France': '/assets/flags/flagFrench.jpg',
    'Mexico': '/assets/flags/flagMexican.jpg',
    'United States': '/assets/flags/flagAmerican.jpg',
    'USA': '/assets/flags/flagAmerican.jpg',
    'Austria': '/assets/flags/flagGerman.jpg' // Using German flag as fallback for Austria
  };
  
  return flagMap[nationality] || '/assets/flags/flagBritish.jpg'; // Default to British flag
};

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
