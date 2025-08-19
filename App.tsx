
import React, { useState, useRef, useEffect, ReactNode } from 'react';

// --- CONSTANTS ---
const SOUND_SPEED_MPS = 343; // meters per second
const METERS_IN_A_MILE = 1609.34;
enum Phase {
  Idle,
  Timing,
  Result,
}

// --- SVG ICONS ---
const ZapIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px currentColor)" }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const SoundWaveIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10v4"/>
        <path d="M6 7v10"/>
        <path d="M10 4v16"/>
        <path d="M14 7v10"/>
        <path d="M18 10v4"/>
    </svg>
);

const RestartIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4"/>
        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>
    </svg>
);

const MapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
        <line x1="1" y1="6" x2="8" y2="2" />
        <line x1="15" y1="2" x2="22" y2="6" />
        <line x1="8" y1="18" x2="8" y2="2" />
        <line x1="15" y1="18" x2="15" y2="2" />
    </svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const AlertTriangleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const AlertOctagonIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);


// --- REUSABLE UI COMPONENTS ---

interface ActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, className = '', variant = 'primary', disabled = false }) => {
  const baseClasses = "flex items-center justify-center gap-3 text-xl md:text-2xl font-bold px-6 py-4 md:px-8 md:py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 w-full max-w-sm transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100";
  const variantClasses = {
    primary: "bg-yellow-400 text-slate-900 hover:bg-yellow-300 focus:ring-yellow-300/50 shadow-yellow-400/30",
    secondary: "bg-cyan-500 text-white hover:bg-cyan-400 focus:ring-cyan-400/50 shadow-cyan-500/30",
    tertiary: "bg-slate-600 text-white hover:bg-slate-500 focus:ring-slate-500/50"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  );
};

interface ResultCardProps {
    value: string;
    unit: string;
    description: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ value, unit, description }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            cardRef.current?.style.setProperty('--x', `${x}px`);
            cardRef.current?.style.setProperty('--y', `${y}px`);
        }
    };
    
    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="aurora-card bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-6 w-full text-center shadow-lg backdrop-blur-md"
        >
            <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter">{value}</p>
            <p className="text-lg sm:text-xl font-medium text-cyan-300">{unit}</p>
            <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>
    );
};

const WeatherMapModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="weather-map-title">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] md:h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                <h3 id="weather-map-title" className="text-xl font-bold text-white">Weather Temperature - Spain</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors rounded-full p-2 -mr-2 -mt-2" aria-label="Close weather map">
                    <XIcon className="w-6 h-6" />
                </button>
            </header>
            <div className="flex-grow bg-slate-900">
                <iframe
                    src="https://embed.windy.com/embed.html?lat=40.417&lon=-3.703&zoom=5&level=surface&overlay=temp&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
                    className="w-full h-full border-0"
                    title="Weather Temperature Map of Spain"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    </div>
);

// --- Phase Components ---

const IdlePhase = ({ onStart }: { onStart: () => void }) => (
    <div className="flex flex-col items-center text-center animate-fade-in">
        <p className="text-slate-300 mb-6 md:mb-8 max-w-md text-lg">
            See lightning? Start the timer. Hear thunder? Stop it. The app will calculate the storm's distance for you.
        </p>
        <ActionButton onClick={onStart} variant="primary">
            <ZapIcon className="w-8 h-8" />
            I Saw Lightning!
        </ActionButton>
    </div>
);

const TimingPhase = ({ elapsedTime, onStop }: { elapsedTime: number, onStop: () => void }) => {
    const seconds = (elapsedTime / 1000);
    return (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-8 md:mb-12">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgb(34 211 238)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - Math.min(seconds / 15, 1))} // Cap at 15 seconds for visual
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-200 ease-linear"
                    />
                </svg>
                <p className="text-6xl md:text-7xl font-black text-white tracking-tighter tabular-nums timer-pulse" aria-live="polite">
                    {seconds.toFixed(2)}
                </p>
            </div>
            <ActionButton onClick={onStop} variant="secondary">
                <SoundWaveIcon className="w-8 h-8" />
                I Heard Thunder!
            </ActionButton>
        </div>
    );
};

const getDistanceInfo = (km: number) => {
    if (km < 1) {
      return {
        text: 'DANGER: The storm is extremely close. Seek shelter immediately!',
        icon: <AlertTriangleIcon className="w-6 h-6 mr-3 flex-shrink-0" />,
        colorClasses: 'bg-red-500/10 border-red-500/30 text-red-300'
      };
    }
    if (km <= 5) {
      return {
        text: 'CAUTION: The storm is very close. Be prepared to seek shelter.',
        icon: <AlertOctagonIcon className="w-6 h-6 mr-3 flex-shrink-0" />,
        colorClasses: 'bg-amber-500/10 border-amber-500/30 text-amber-300'
      };
    }
    if (km <= 10) {
      return {
        text: 'NOTICE: The storm is nearby. Monitor conditions.',
        icon: <InfoIcon className="w-6 h-6 mr-3 flex-shrink-0" />,
        colorClasses: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
      };
    }
    return {
      text: 'The storm appears to be at a safe distance.',
      icon: <InfoIcon className="w-6 h-6 mr-3 flex-shrink-0" />,
      colorClasses: 'bg-slate-700/50 border-slate-600/50 text-slate-300'
    };
};

const ResultPhase = ({ seconds, distanceMiles, distanceKm, onReset }: { seconds: number, distanceMiles: string, distanceKm: number, onReset: () => void }) => {
    const { text, icon, colorClasses } = getDistanceInfo(distanceKm);
    
    return (
        <div className="flex flex-col items-center gap-6 w-full px-4 text-center animate-stagger">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Strike Distance Estimate</h2>
                <p className="text-slate-300 text-lg">Based on a {seconds.toFixed(2)} second delay.</p>
            </div>

            <div className={`flex items-center p-4 rounded-lg border w-full max-w-2xl text-left ${colorClasses}`}>
                {icon}
                <p className="font-medium">{text}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
                <ResultCard value={distanceMiles} unit="Miles" description="Imperial" />
                <ResultCard value={distanceKm.toFixed(2)} unit="Kilometers" description="Metric" />
            </div>

            <div className="text-center text-slate-400 text-sm p-4 bg-slate-800/50 rounded-lg max-w-2xl w-full">
                <p className="font-bold text-slate-300 mb-1">How is this calculated?</p>
                <p>The distance is estimated using the formula: <code className="bg-slate-900 px-2 py-1 rounded-md text-slate-300">Distance = Time × Speed of Sound</code>. We use ~343 m/s for the speed of sound.</p>
            </div>

            <ActionButton onClick={onReset} variant="tertiary" className="mt-2">
                <RestartIcon className="w-8 h-8" />
                Measure Again
            </ActionButton>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [phase, setPhase] = useState<Phase>(Phase.Idle);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isMapVisible, setMapVisible] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (phase !== Phase.Timing) {
      return;
    }

    let animationFrameId: number;
    const animate = () => {
      if (startTimeRef.current !== undefined) {
        setElapsedTime(performance.now() - startTimeRef.current);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase]);

  const startTimer = () => {
    setIsFlashing(true);
    setElapsedTime(0);
    startTimeRef.current = performance.now();
    setPhase(Phase.Timing);
    setTimeout(() => setIsFlashing(false), 500); // Duration matches animation
  };
  
  const stopTimer = () => {
    setPhase(Phase.Result);
  };

  const reset = () => {
    setElapsedTime(0);
    startTimeRef.current = undefined;
    setPhase(Phase.Idle);
  };

  const seconds = elapsedTime / 1000;
  const distanceMeters = seconds * SOUND_SPEED_MPS;
  const distanceKm = distanceMeters / 1000;
  const distanceMiles = (distanceMeters / METERS_IN_A_MILE).toFixed(2);
  
  const renderContent = () => {
    switch (phase) {
      case Phase.Timing:
        return <TimingPhase elapsedTime={elapsedTime} onStop={stopTimer} />;
      case Phase.Result:
        return <ResultPhase seconds={seconds} distanceMiles={distanceMiles} distanceKm={distanceKm} onReset={reset} />;
      case Phase.Idle:
      default:
        return <IdlePhase onStart={startTimer} />;
    }
  };

  return (
    <main className={`bg-slate-900 min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 text-white overflow-hidden relative ${isFlashing ? 'lightning-flash' : ''}`}>
        <div className="storm-bg"></div>
        <div className="animated-gradient-overlay"></div>
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl">
            <header className="mb-8 md:mb-12 w-full">
                 <div className="flex justify-between items-center w-full gap-4">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 animate-fade-in-down text-left">
                        Lightning Distance Calculator
                    </h1>
                    <button
                        onClick={() => setMapVisible(true)}
                        aria-label="View weather map"
                        className="p-3 rounded-full bg-slate-800/60 border border-slate-700 text-cyan-300 hover:bg-slate-700/80 hover:text-white transition-all duration-300 animate-fade-in-down flex-shrink-0"
                    >
                        <MapIcon className="w-7 h-7" />
                    </button>
                </div>
            </header>
            <section className="w-full flex items-center justify-center min-h-[350px] md:min-h-[400px]">
                {/* A key is used to force re-mounting on phase change, which will re-trigger animations */}
                <div key={phase} className="w-full">
                    {renderContent()}
                </div>
            </section>
            <footer className="mt-12 text-slate-500 text-sm">
                <p>Calculations are an approximation based on the speed of sound.</p>
            </footer>
        </div>
        {isMapVisible && <WeatherMapModal onClose={() => setMapVisible(false)} />}
    </main>
  );
}
