import React from 'react';
import { DriverStanding } from './types';

type CardProps = {
  driverStanding: DriverStanding;
};

const Card: React.FC<CardProps> = ({ driverStanding }) => {
  const { Driver, Constructors, points } = driverStanding;

  return (
    <>
      <h2>{`${Driver.givenName} ${Driver.familyName}`}</h2>
      <p>Points: {points}</p>
      <p>Nationality: {Driver.nationality}</p>
      <p>Team: {Constructors[0].name}</p>
    </>
  );
};

export default Card;
