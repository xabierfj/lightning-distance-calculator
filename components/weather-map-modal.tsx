"use client";

import { memo } from "react";
import { XIcon } from "./icons";

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

export default memo(WeatherMapModal);