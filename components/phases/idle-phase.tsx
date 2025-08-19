import { memo } from "react";
import ActionButton from "../ui/action-button";
import { ZapIcon } from "../icons";

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

export default memo(IdlePhase);