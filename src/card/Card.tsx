import React from 'react';
import '../card/card.css';
import { DriverStanding } from './types';
import flagDutch from '../assets/flags/flagDutch.jpg';
import flagMexican from '../assets/flags/flagMexican.jpg';
import flagSpanish from '../assets/flags/flagSpanish.png';
import flagBritish from '../assets/flags/flagBritish.jpg';
import flagMonaco from '../assets/flags/flagMonaco.png';
import flagCanadian from '../assets/flags/flagCanadian.jpg';
import flagFrench from '../assets/flags/flagFrench.jpg';
import flagAustralian from '../assets/flags/flagAustralian.jpg';
import flagThai from '../assets/flags/flagThai.jpg';
import flagGerman from '../assets/flags/flagGerman.jpg';
import flagFinnish from '../assets/flags/flagFinnish.jpg';
import flagChinese from '../assets/flags/flagChina.jpg';
import flagJapanese from '../assets/flags/flagJapan.jpg';
import flagDanish from '../assets/flags/flagDanish.jpg';
import flagAmerican from '../assets/flags/flagAmerican.jpg';

type FlagMap = {
  [key: string]: string;
};

const flagMap: FlagMap = {
  Dutch: flagDutch,
  Mexican: flagMexican,
  Spanish: flagSpanish,
  British: flagBritish,
  Monegasque: flagMonaco,
  Canadian: flagCanadian,
  French: flagFrench,
  Australian: flagAustralian,
  Thai: flagThai,
  German: flagGerman,
  Finnish: flagFinnish,
  Chinese: flagChinese,
  Japanese: flagJapanese,
  Danish: flagDanish,
  American: flagAmerican,
};

type CardProps = {
  driverStanding: DriverStanding;
  isFirstDriver: boolean;
  position: number;
};

const Card: React.FC<CardProps> = ({ driverStanding, isFirstDriver, position  }) => {
  const { Driver, Constructors, points } = driverStanding;
  const permanentNumber = isFirstDriver ? '1' : Driver.permanentNumber;
  const flagImage = flagMap[Driver.nationality];
  

  return (
    <>
      <div className='driver-card'>

        <div className='flex justify-between border-b-[1px] text-3xl font-bold py-1'>
          <p className='F1-Bold text-5xl'>{position}</p>

          <div className='ml-auto F1'>
            <p className='text-xl'>{points}</p>
            <p className='text-white bg-black text-sm text-center '>PTS</p>
          </div>
        </div>
        
        <div className='border-b-[1px] py-1 flex'>

          <div className='mr-auto'>
            <h3 className='text-base'>{Driver.givenName}</h3>
            <h2 className='text-2xl'>{Driver.familyName}</h2>        
          </div>

          <div className='ml-auto self-center'>
                {flagImage && <img className='flag' src={flagImage} alt="Flag"/>}
              </div>
        </div>

        <p>{Constructors[0].name}</p>
        <p className='text-3xl'>{permanentNumber}</p>
        
      </div>
    </>
  );
};

export default Card;
