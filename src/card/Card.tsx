import React from 'react';
import '../card/card.css';
import { DriverStanding } from './types';

type CardProps = {
  driverStanding: DriverStanding;
  isFirstDriver: boolean;
  position: number;
};

const Card: React.FC<CardProps> = ({ driverStanding, isFirstDriver, position  }) => {
  const { Driver, Constructors, points } = driverStanding;
  const permanentNumber = isFirstDriver ? '1' : Driver.permanentNumber;
  

  return (
    <>
      <div className='driver-card'>

        <div className='flex justify-between border-b-[1px] text-3xl font-bold py-3'>
          <p className='F1-Bold text-5xl'>{position}</p>
          <div className='ml-auto F1'>
            <p className='text-xl text-center'>{points}</p>
            <p className='text-white bg-black text-sm text-center '>PTS</p>
          </div>          
        </div>
        
        <div className='border-b-[1px] py-3 flex items-center justify-between'>
          <div className='flex-1 min-w-0'>
            <h3 className='text-base truncate'>{Driver.givenName}</h3>
            <h2 className='text-2xl truncate'>{Driver.familyName}</h2>        
          </div>
          <div className='flex-shrink-0 ml-2'>
            {Driver.flag && <img className='flag' src={Driver.flag} alt={`${Driver.nationality} flag`}/>}
          </div>
        </div>

        <div className='py-3'>
          <p className='F1 text-gray-500'>{Constructors[0].name}</p>
          <p className='text-3xl'>{permanentNumber}</p>
        </div>

      </div>
    </>
  );
};

export default Card;
