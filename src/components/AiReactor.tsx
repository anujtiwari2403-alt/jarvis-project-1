import React from 'react';
import { AssistantState } from '../types/assistant';

interface AiReactorProps {
  state: AssistantState;
  onStateSelect: (state: AssistantState) => void;
  interimTranscript?: string;
  size?: 'normal' | 'large';
  onMicClick?: () => void;
}

export const AiReactor: React.FC<AiReactorProps> = ({
  state,
  onStateSelect,
  interimTranscript = '',
  size = 'large',
  onMicClick,
}) => {
  const getStatusHeadline = () => {
    switch (state) {
      case 'LISTENING':
        return 'LISTENING TO VOCAL INPUT...';
      case 'THINKING':
        return 'PROCESSING DIRECTIVE...';
      case 'SPEAKING':
        return 'TRANSMITTING RESPONSE...';
      case 'ERROR':
        return 'SYSTEM ATTENTION REQUIRED';
      case 'OFFLINE':
        return 'SYSTEM STANDBY';
      case 'IDLE':
      default:
        return 'AWAITING VOCAL INPUT';
    }
  };

  const getSubtext = () => {
    switch (state) {
      case 'LISTENING':
        return 'Speak naturally in English, Hindi, or Hinglish...';
      case 'THINKING':
        return 'Analyzing tokens & resolving approved skill...';
      case 'SPEAKING':
        return 'Speaking response aloud (Press HALT to stop)';
      case 'ERROR':
        return 'Check microphone permissions or network connectivity';
      case 'IDLE':
      default:
        return 'Press [Spacebar] or tap the Core / Mic button below';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-6 px-4 w-full">
      {/* Background Soft Atmospheric Halos */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#00f0ff]/5 blur-3xl pointer-events-none -z-10"></div>

      {/* State Indicator Badges */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0d1726]/80 backdrop-blur-md rounded-full border border-[#00f0ff]/20 mb-4 z-10">
        {(['IDLE', 'LISTENING', 'THINKING', 'SPEAKING'] as AssistantState[]).map((st) => {
          const isActive = state === st;
          return (
            <button
              key={st}
              onClick={() => onStateSelect(st)}
              className={`px-3 py-1 rounded-full font-mono-tech text-[10px] tracking-wider transition-all font-semibold ${
                isActive
                  ? st === 'LISTENING'
                    ? 'bg-[#00e599] text-[#05080d] shadow-[0_0_12px_rgba(0,229,153,0.5)]'
                    : st === 'THINKING'
                    ? 'bg-[#ffb020] text-[#05080d] shadow-[0_0_12px_rgba(255,176,32,0.5)]'
                    : st === 'SPEAKING'
                    ? 'bg-[#00f0ff] text-[#05080d] shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                    : 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                  : 'text-[#849495] hover:text-[#dee2ed] hover:bg-[#171c23]'
              }`}
            >
              [{st}]
            </button>
          );
        })}
      </div>

      {/* Large Centered Holographic AI Reactor */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center my-2">
        {/* Degree Markings Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#00f0ff]/25 anim-spin-slow pointer-events-none"></div>
        <div className="absolute inset-3 rounded-full border border-[#62d5f2]/15 pointer-events-none"></div>

        {/* Reticle Coordinates */}
        <span className="absolute -top-1 font-mono-tech text-[10px] text-[#62d5f2] tracking-widest select-none">
          000°
        </span>
        <span className="absolute -bottom-1 font-mono-tech text-[10px] text-[#62d5f2] tracking-widest select-none">
          180°
        </span>
        <span className="absolute -left-1 font-mono-tech text-[10px] text-[#62d5f2] tracking-widest select-none">
          270°
        </span>
        <span className="absolute -right-1 font-mono-tech text-[10px] text-[#62d5f2] tracking-widest select-none">
          090°
        </span>

        {/* Concentric Counter-Rotating Arcs */}
        <div className="absolute inset-7 rounded-full border border-[#00f0ff]/30 anim-spin-reverse pointer-events-none"></div>

        {/* Dynamic SVG Arcs */}
        <svg className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] pointer-events-none" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeDasharray="14 10"
            opacity="0.35"
          />
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="#62d5f2"
            strokeWidth="1.5"
            strokeDasharray="40 18"
            opacity="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="58"
            fill="none"
            stroke="#adecff"
            strokeWidth="1"
            strokeDasharray="6 8"
            opacity="0.4"
          />

          {/* Radar Sweep Effect */}
          <g className="anim-radar" style={{ transformOrigin: '100px 100px' }}>
            <path
              d="M 100 100 L 100 15 A 85 85 0 0 1 165 42 Z"
              fill="url(#reactor-sweep)"
            />
          </g>

          <defs>
            <linearGradient id="reactor-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Pulsing Holographic Core */}
        <div
          onClick={onMicClick}
          className={`cursor-pointer group relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
            state === 'LISTENING'
              ? 'bg-[#00e599]/15 border-2 border-[#00e599] shadow-[0_0_40px_rgba(0,229,153,0.5)]'
              : state === 'THINKING'
              ? 'bg-[#ffb020]/15 border-2 border-[#ffb020] shadow-[0_0_40px_rgba(255,176,32,0.4)]'
              : state === 'SPEAKING'
              ? 'bg-[#00f0ff]/20 border-2 border-[#00f0ff] shadow-[0_0_45px_rgba(0,240,255,0.6)]'
              : 'bg-[#00f0ff]/10 border border-[#00f0ff]/50 shadow-[0_0_35px_rgba(0,240,255,0.35)] anim-core'
          }`}
          title="Click to toggle voice capture"
        >
          {/* Inner Core Container */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#080d14]/90 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center border border-[#00f0ff]/30 shadow-inner">
            <span
              className={`material-symbols-outlined text-[34px] sm:text-[40px] transition-all ${
                state === 'LISTENING'
                  ? 'text-[#00e599] animate-pulse'
                  : state === 'THINKING'
                  ? 'text-[#ffb020] animate-spin'
                  : state === 'SPEAKING'
                  ? 'text-[#00f0ff] animate-bounce'
                  : 'text-[#00f0ff]'
              }`}
            >
              {state === 'THINKING' ? 'cyclone' : state === 'SPEAKING' ? 'volume_up' : state === 'LISTENING' ? 'mic' : 'neurology'}
            </span>
            <span className="font-mono-tech text-[9px] tracking-widest text-[#7df4ff] font-bold mt-1 uppercase">
              {state}
            </span>
          </div>
        </div>

        {/* Reticle Hairline Ticks */}
        <div className="absolute top-1/2 left-2 w-4 h-[1px] bg-[#00f0ff] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-2 w-4 h-[1px] bg-[#00f0ff] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute left-1/2 top-2 h-4 w-[1px] bg-[#00f0ff] -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute left-1/2 bottom-2 h-4 w-[1px] bg-[#00f0ff] -translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* Main Status Headline */}
      <div className="flex flex-col items-center text-center mt-3 z-10 max-w-lg">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-[#dbfcff] font-semibold tracking-wide">
          {getStatusHeadline()}
        </h2>

        {/* Real-time Interim Live Speech Preview */}
        {interimTranscript ? (
          <div className="mt-2 px-4 py-1.5 bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.2)] animate-pulse">
            <span className="font-mono-tech text-xs sm:text-sm text-[#00f0ff] font-medium">
              "{interimTranscript}"
            </span>
          </div>
        ) : (
          <p className="font-body text-xs sm:text-sm text-[#849495] mt-1.5">
            {getSubtext()}
          </p>
        )}
      </div>
    </div>
  );
};
