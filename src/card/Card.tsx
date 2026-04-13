import React from 'react';
import '../card/card.css';
import { DriverStanding } from './types';

type CardProps = {
  driverStanding: DriverStanding;
  position: number;
};

const Card: React.FC<CardProps> = ({ driverStanding, position }) => {
  const { Driver, Constructors, points } = driverStanding;

  return (
    <>
      <div className='driver-card'>

        <div className='flex justify-between driver-card-row-top text-3xl font-bold py-3'>
          <p className='F1-Bold text-5xl driver-card-pos'>{position}</p>
          <div className='ml-auto F1 driver-card-pts-wrap'>
            <p className='text-xl text-center driver-card-pts-value'>{points}</p>
            <p className='text-sm text-center driver-card-pts-label py-0.5 px-1'>PTS</p>
          </div>          
        </div>
        
        <div className='driver-card-row-mid py-3 flex items-center justify-between'>
          <div className='flex-1 min-w-0'>
            <h3 className='text-base truncate driver-card-name-sm'>{Driver.givenName}</h3>
            <h2 className='text-2xl truncate driver-card-name-lg'>{Driver.familyName}</h2>        
          </div>
          <div className='flex-shrink-0 ml-2'>
            {Driver.flag && <img className='flag' src={Driver.flag} alt={`${Driver.nationality} flag`}/>}
          </div>
        </div>

        <div className='py-3'>
          <p className='F1 driver-card-team'>{Constructors[0].name}</p>
          <p className='text-3xl driver-card-number'>{Driver.permanentNumber}</p>
        </div>

      </div>
    </>
  );
};

export default Card;
