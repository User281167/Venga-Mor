import { ChevronUp, ChevronDown } from "lucide-react";

interface NavButtonProps {
  direction: "up" | "down";
  onClick: () => void;
  disabled: boolean;
}

export function NavButton({ direction, onClick, disabled }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "up" ? "Post anterior" : "Post siguiente"}
      className="
        hidden md:flex
        items-center justify-center
        w-8 h-8 rounded-full
        border border-white/15
        bg-black/40 backdrop-blur-sm
        text-white/60
        transition-all duration-200
        hover:bg-white/15 hover:text-white hover:border-white/30 hover:scale-110
        active:scale-95
        disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100
        disabled:hover:bg-black/40 disabled:hover:text-white/60
      "
    >
      {direction === "up" ? (
        <ChevronUp size={16} strokeWidth={2} />
      ) : (
        <ChevronDown size={16} strokeWidth={2} />
      )}
    </button>
  );
}
