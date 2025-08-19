import { memo } from "react";
import ActionButton from "../ui/action-button";
import { SoundWaveIcon } from "../icons";

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

export default memo(TimingPhase);