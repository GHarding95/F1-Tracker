import React from 'react';
import './constructor-logo.css';

type ConstructorLogoProps = {
  constructorId: string;
  teamName: string;
};

type TeamStyle = { src: string } & ({ bg: string } | { bgGradient: string });

const TEAM_ASSETS: Record<string, TeamStyle> = {
  mercedes: {
    src: '/assets/logos/2026mercedeslogowhite.avif',
    bg: '#00d2be',
  },
  ferrari: {
    src: '/assets/logos/2026ferrarilogowhite.avif',
    bg: '#e30613',
  },
  red_bull: {
    src: '/assets/logos/2026redbullracinglogowhite.avif',
    bgGradient: 'linear-gradient(135deg, #00162b 50%, #E1071F 50%)',
  },
  mclaren: {
    src: '/assets/logos/2026mclarenlogowhite.avif',
    bg: '#ff8000',
  },
  alpine: {
    src: '/assets/logos/2026alpinelogowhite.avif',
    bgGradient: 'linear-gradient(135deg, #0090ff 0%, #ff4bc7 100%)',
  },
  aston_martin: {
    src: '/assets/logos/2026astonmartinlogowhite.avif',
    bg: '#006f62',
  },
  haas: {
    src: '/assets/logos/2026haasf1teamlogowhite.avif',
    bg: '#3d4549',
  },
  williams: {
    src: '/assets/logos/2026williamslogowhite.avif',
    bg: '#005aff',
  },
  rb: {
    src: '/assets/logos/2026racingbullslogowhite.avif',
    bg: '#1e2a78',
  },
  audi: {
    src: '/assets/logos/2026audilogowhite.avif',
    bg: '#bb0a30',
  },
  cadillac: {
    src: '/assets/logos/2026cadillaclogowhite.avif',
    bg: '#1a1a1a',
  },
};

const ConstructorLogo: React.FC<ConstructorLogoProps> = ({ constructorId, teamName }) => {
  const config = TEAM_ASSETS[constructorId];

  if (!config) {
    return (
      <div
        className="flex-shrink-0 ml-2 constructor-logo-wrap"
        role="img"
        title={teamName}
        aria-label={`${teamName} logo`}
      >
        <div className="constructor-logo-circle" style={{ backgroundColor: '#3f3f46' }}>
          <span className="constructor-logo-fallback">F1</span>
        </div>
      </div>
    );
  }

  const circleStyle: React.CSSProperties =
    'bgGradient' in config
      ? { background: config.bgGradient }
      : { backgroundColor: config.bg };

  return (
    <div
      className="flex-shrink-0 ml-2 constructor-logo-wrap"
      role="img"
      title={teamName}
      aria-label={`${teamName} logo`}
    >
      <div className="constructor-logo-circle" style={circleStyle}>
        <img className="constructor-logo-img" src={config.src} alt="" draggable={false} />
      </div>
    </div>
  );
};

export default ConstructorLogo;
