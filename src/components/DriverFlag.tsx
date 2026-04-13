import React from 'react';
import './driver-flag.css';

type DriverFlagProps = {
  flag?: string | null;
  nationality: string;
};

const DriverFlag: React.FC<DriverFlagProps> = ({ flag, nationality }) => {
  if (!flag) return null;

  return (
    <div className="flex-shrink-0 ml-2">
      <img className="flag" src={flag} alt={`${nationality} flag`} />
    </div>
  );
};

export default DriverFlag;
