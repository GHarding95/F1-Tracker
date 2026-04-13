import React, { useEffect, useRef } from 'react';
import Footer from './Footer';
import './landing-splash.css';

type LandingSplashProps = {
  active: boolean;
  onExited?: () => void;
};

const EXIT_MS = 700;

const LandingSplash: React.FC<LandingSplashProps> = ({ active, onExited }) => {
  const onExitedRef = useRef(onExited);
  const exitedDoneRef = useRef(false);
  onExitedRef.current = onExited;

  useEffect(() => {
    if (active) {
      exitedDoneRef.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      if (exitedDoneRef.current) return;
      exitedDoneRef.current = true;
      onExitedRef.current?.();
    }, EXIT_MS);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <div
      className={`landing-splash ${!active ? 'landing-splash--exit' : ''}`}
      aria-hidden={!active}
    >
      <div className="landing-splash__scanlines" aria-hidden />

      <div className="landing-splash__middle">
        <div className="landing-splash__center">
          <div className="landing-splash__badge F1-Bold">
            <span className="landing-splash__badge-f">F</span>
            <span className="landing-splash__badge-one">1</span>
            <span className="landing-splash__badge-tracker"> Tracker</span>
          </div>
          <div className="landing-splash__rings" aria-hidden>
            <span className="landing-splash__ring" />
            <span className="landing-splash__ring landing-splash__ring--delay" />
          </div>
        </div>
      </div>

      <Footer variant="splash" />
    </div>
  );
};

export default LandingSplash;
