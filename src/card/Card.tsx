import React from 'react';
import { DriverStanding } from './types';

type CardProps = {
  driverStanding: DriverStanding;
  isFirstDriver: Boolean;
};

const Card: React.FC<CardProps> = ({ driverStanding, isFirstDriver }) => {
  const { Driver, Constructors, points } = driverStanding;
  const permanentNumber = isFirstDriver ? '1' : Driver.permanentNumber;

  return (
    <>
      <h2>{`${Driver.givenName} ${Driver.familyName}`}</h2>
      <p>Points: {points}</p>
      <p>Nationality: {Driver.nationality}</p>
      <p>Team: {Constructors[0].name}</p>
      <p>{permanentNumber}</p>
    </>
  );
};

export default Card;
