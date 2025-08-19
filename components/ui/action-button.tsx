import { ReactNode, memo } from "react";

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

export default memo(ActionButton);