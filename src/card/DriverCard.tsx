import React from 'react';
import { DriverStanding } from './types';

interface DriverCardProps {
  driverStanding: DriverStanding;
}

const DriverCard: React.FC<DriverCardProps> = ({ driverStanding }) => {
  return (
    <div className="driver-card">
      <h2>{driverStanding.Driver.givenName} {driverStanding.Driver.familyName}</h2>
      <p>Position: {driverStanding.position}</p>
      <p>Points: {driverStanding.points}</p>
      <p>Nationality: {driverStanding.Driver.nationality}</p>
      <p>Team: {driverStanding.Constructors.name}</p>
    </div>
  );
};

export default DriverCard;