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
  Monaco: flagMonaco,
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

        <div className='flex'>
          <p className='pr-5'>{position}</p>
          <p>Points: {points}</p>
        </div>
        
          <h3>{Driver.givenName}</h3>
          <div className='flex'>
            <h2>{Driver.familyName}</h2>        
            {flagImage && <img className='flag' src={flagImage} alt="Flag"/>}
          </div>

        <p>Team: {Constructors[0].name}</p>
        <p>{permanentNumber}</p>
        
      </div>
    </>
  );
};

export default Card;
