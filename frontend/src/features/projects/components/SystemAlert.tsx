// frontend/src/components/SystemAlert.tsx
import { Zap, AlertTriangle, X } from "lucide-react";

export function SystemAlert({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fade-in_0.3s_ease]">
      <div
        className="relative bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.4)] px-8 py-8 max-w-md w-full mx-4 shadow-2xl"
        style={{ 
          boxShadow: "0 0 60px rgba(79,195,247,0.15), inset 0 0 40px rgba(79,195,247,0.03)",
          animation: "pop-in 0.3s ease-out"
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4">
          <div className="absolute top-0 left-0 w-full h-px bg-[rgba(79,195,247,0.5)]" />
          <div className="absolute top-0 left-0 h-full w-px bg-[rgba(79,195,247,0.5)]" />
        </div>
        <div className="absolute top-2 right-2 w-4 h-4">
          <div className="absolute top-0 right-0 w-full h-px bg-[rgba(79,195,247,0.5)]" />
          <div className="absolute top-0 right-0 h-full w-px bg-[rgba(79,195,247,0.5)]" />
        </div>
        <div className="absolute bottom-2 left-2 w-4 h-4">
          <div className="absolute bottom-0 left-0 w-full h-px bg-[rgba(79,195,247,0.5)]" />
          <div className="absolute bottom-0 left-0 h-full w-px bg-[rgba(79,195,247,0.5)]" />
        </div>
        <div className="absolute bottom-2 right-2 w-4 h-4">
          <div className="absolute bottom-0 right-0 w-full h-px bg-[rgba(79,195,247,0.5)]" />
          <div className="absolute bottom-0 right-0 h-full w-px bg-[rgba(79,195,247,0.5)]" />
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 hover:bg-[rgba(79,195,247,0.1)] transition-colors rounded-sm"
        >
          <X size={16} className="text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7]" />
        </button>

        <div className="text-center space-y-5">
          {/* Icon container */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border border-[rgba(79,195,247,0.3)] animate-ping rounded-sm" />
            <div className="relative w-full h-full border border-[rgba(79,195,247,0.5)] bg-[rgba(79,195,247,0.05)] flex items-center justify-center">
              <Zap size={28} className="text-[#4fc3f7] animate-pulse" />
            </div>
          </div>

          {/* Title section */}
          <div>
            <p className="text-[10px] tracking-[3px] text-[rgba(79,195,247,0.5)] mb-2 uppercase font-semibold">
              SYSTEM ALERT
            </p>
            <h2 className="font-['Cinzel',serif] text-xl font-bold tracking-[2px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
              NEW GATE DETECTED
            </h2>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-xs text-[rgba(79,195,247,0.7)] leading-relaxed tracking-wide">
              An unstable dimensional rift has been detected in your sector.
            </p>
            <p className="text-[11px] text-[rgba(79,195,247,0.4)] leading-relaxed">
              Gate registration protocol has been initiated.
            </p>
          </div>

          {/* Progress bar animation */}
          <div className="w-full h-[1px] bg-[rgba(79,195,247,0.1)] overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent animate-[scan_1.5s_linear_infinite]" />
          </div>

          {/* Action button */}
          <button
            onClick={onDismiss}
            className="w-full py-3 border border-[rgba(79,195,247,0.4)] text-[10px] font-semibold tracking-[3px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.1)] hover:border-[rgba(79,195,247,0.6)] transition-all duration-200 active:scale-95"
          >
            Begin Registration
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}