import { memo } from "react";
import ActionButton from "../ui/action-button";
import ResultCard from "../ui/result-card";
import { RestartIcon, AlertTriangleIcon, AlertOctagonIcon, InfoIcon } from "../icons";

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

export default memo(ResultPhase);