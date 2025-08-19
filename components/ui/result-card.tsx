"use client";

import { useRef, memo } from "react";

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

export default memo(ResultCard);