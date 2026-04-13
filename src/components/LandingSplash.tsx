import React, { useEffect, useRef } from 'react';
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
      <div className="landing-splash__aurora" aria-hidden />
      <div className="landing-splash__scanlines" aria-hidden />
      <div className="landing-splash__speed" aria-hidden>
        <div className="landing-splash__speed-layer landing-splash__speed-layer--a" />
        <div className="landing-splash__speed-layer landing-splash__speed-layer--b" />
      </div>
      <div className="landing-splash__chevron-wrap" aria-hidden>
        <div className="landing-splash__chevron" />
      </div>
      <div className="landing-splash__checkered" aria-hidden />

      <div className="landing-splash__center">
        <div className="landing-splash__badge">
          <span className="landing-splash__badge-f F1-Bold">F</span>
          <span className="landing-splash__badge-one F1-Bold">1</span>
        </div>
        <div className="landing-splash__pulse" aria-hidden />
        <div className="landing-splash__rings" aria-hidden>
          <span className="landing-splash__ring" />
          <span className="landing-splash__ring landing-splash__ring--delay" />
        </div>
      </div>

      <div className="landing-splash__footer">
        <div className="landing-splash__bar">
          <div className="landing-splash__bar-fill" />
        </div>
      </div>
    </div>
  );
};

export default LandingSplash;
