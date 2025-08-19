"use client";

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapIcon } from './icons';
import IdlePhase from './phases/idle-phase';
import TimingPhase from './phases/timing-phase';
import ResultPhase from './phases/result-phase';

// Lazy-load the modal component for better performance
const DynamicWeatherMapModal = dynamic(() => import('./weather-map-modal'), {
  ssr: false,
});

// --- CONSTANTS ---
const SOUND_SPEED_MPS = 343; // meters per second
const METERS_IN_A_MILE = 1609.34;
enum Phase {
  Idle,
  Timing,
  Result,
}

export default function Calculator() {
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
    <>
      <div className={`relative z-10 flex flex-col items-center text-center w-full max-w-4xl ${isFlashing ? 'lightning-flash' : ''}`}>
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
      </div>
      {isMapVisible && <DynamicWeatherMapModal onClose={() => setMapVisible(false)} />}
    </>
  );
}