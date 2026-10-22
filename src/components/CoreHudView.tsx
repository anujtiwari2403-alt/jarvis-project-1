import React from 'react';
import { AssistantState } from '../types/assistant';
import { AiReactor } from './AiReactor';
import { HarmonicSpectrum } from './HarmonicSpectrum';

interface CoreHudViewProps {
  assistantState: AssistantState;
  onStateSelect: (state: AssistantState) => void;
  onInterrupt: () => void;
  onOpenAction: (actionType: string) => void;
}

export const CoreHudView: React.FC<CoreHudViewProps> = ({
  assistantState,
  onStateSelect,
  onInterrupt,
  onOpenAction,
}) => {
  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 py-2 gap-4 text-[#dee2ed]">
      {/* 1. Reactor Telemetry Banner Card */}
      <div className="flex flex-col gap-2 bg-[#171c23]/80 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-[#00f0ff]/20 shadow-[0_0_20px_rgba(0,240,255,0.06)] relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#00f0ff]/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-[#3b494b]/30 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] glow-dot"></span>
            <span className="font-mono-tech text-[10px] sm:text-xs text-[#dbfcff] uppercase tracking-widest font-semibold">
              REACTOR TEL // 0x488-ARC
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono-tech text-[9px] sm:text-[10px] text-[#62d5f2] bg-[#1b2027] px-2 py-0.5 rounded-full">
              FREQ: 4.88 GHz
            </span>
            <span className="font-mono-tech text-[9px] sm:text-[10px] text-[#00f0ff] bg-[#252a32] px-2 py-0.5 rounded-full">
              LOAD: 24%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Ambient Temp */}
          <div className="flex flex-col gap-0.5 bg-[#1b2027]/60 px-3 py-1.5 rounded">
            <div className="flex items-center justify-between">
              <span className="font-mono-tech text-[10px] text-[#b9cacb] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#00f0ff]">thermostat</span>
                AMBIENT
              </span>
              <span className="font-mono-tech text-[10px] text-[#dee2ed] font-semibold">21.4°C</span>
            </div>
            <div className="w-full bg-[#30353d] h-1 rounded-full overflow-hidden mt-0.5">
              <div className="bg-[#00f0ff] h-full w-[44%] shadow-[0_0_6px_#00f0ff]"></div>
            </div>
          </div>

          {/* Mic Gain */}
          <div className="flex flex-col gap-0.5 bg-[#1b2027]/60 px-3 py-1.5 rounded">
            <div className="flex items-center justify-between">
              <span className="font-mono-tech text-[10px] text-[#b9cacb] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#62d5f2]">graphic_eq</span>
                MIC GAIN
              </span>
              <span className="font-mono-tech text-[10px] text-[#62d5f2] font-semibold">OPTIMAL</span>
            </div>
            <div className="flex items-end gap-1 h-1.5 mt-0.5">
              <span className="w-1.5 h-full bg-[#62d5f2] rounded-xs"></span>
              <span className="w-1.5 h-full bg-[#62d5f2] rounded-xs"></span>
              <span className="w-1.5 h-full bg-[#62d5f2] rounded-xs"></span>
              <span className="w-1.5 h-2/3 bg-[#62d5f2]/60 rounded-xs"></span>
              <span className="w-1.5 h-1/3 bg-[#3b494b]/40 rounded-xs"></span>
            </div>
          </div>
        </div>

        {/* Synced Node Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <div className="flex items-center gap-1.5 bg-[#30353d]/40 px-2.5 py-1 rounded-full whitespace-nowrap border border-[#3b494b]/20">
            <span className="material-symbols-outlined text-[13px] text-[#00f0ff]">laptop_mac</span>
            <span className="font-mono-tech text-[10px] text-[#dee2ed]">MBP M3 MAX</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span className="font-mono-tech text-[10px] text-[#00f0ff] font-bold">SYNC 100%</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#30353d]/40 px-2.5 py-1 rounded-full whitespace-nowrap border border-[#3b494b]/20">
            <span className="material-symbols-outlined text-[13px] text-[#62d5f2]">smartphone</span>
            <span className="font-mono-tech text-[10px] text-[#dee2ed]">S24 ULTRA</span>
            <span className="font-mono-tech text-[10px] text-[#62d5f2] font-semibold">[HOST]</span>
          </div>
        </div>
      </div>

      {/* 2. Concentric AI Reactor */}
      <AiReactor
        state={assistantState}
        onStateSelect={onStateSelect}
      />

      {/* 3. Harmonic Spectrum */}
      <HarmonicSpectrum
        isListening={assistantState === 'LISTENING'}
        isSpeaking={assistantState === 'SPEAKING'}
        onInterrupt={onInterrupt}
        barCount={24}
      />

      {/* 4. Predictive Context & Queue */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono-tech text-[10px] text-[#b9cacb] uppercase tracking-wider">
            PREDICTIVE CONTEXT & QUEUE
          </span>
          <span className="font-mono-tech text-[10px] text-[#adecff]">LIVE AGENTS (2)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Directive 1 */}
          <div
            onClick={() => onOpenAction('reminder')}
            className="cursor-pointer group relative bg-[#1b2027]/70 hover:bg-[#252a32]/80 backdrop-blur-md p-3.5 rounded-xl border border-[#00f0ff]/20 hover:border-[#00f0ff]/40 flex flex-col gap-1.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">schedule</span>
                <span className="font-mono-tech text-[10px] text-[#dbfcff] font-semibold">NEXT DIRECTIVE // 14:00</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#62d5f2]"></span>
            </div>
            <p className="font-body text-xs text-[#dee2ed] font-medium leading-snug">
              Synchronize Workspace Architecture & Repository Commits
            </p>
            <span className="font-mono-tech text-[9px] text-[#b9cacb]">
              Target: Dev Cloud Core // Auto-execute: YES
            </span>
          </div>

          {/* Context 2 */}
          <div
            onClick={() => onOpenAction('note')}
            className="cursor-pointer group relative bg-[#1b2027]/70 hover:bg-[#252a32]/80 backdrop-blur-md p-3.5 rounded-xl border border-[#3b494b]/30 hover:border-[#62d5f2]/40 flex flex-col gap-1.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#62d5f2]">memory</span>
                <span className="font-mono-tech text-[10px] text-[#62d5f2] font-semibold">ACTIVE CONTEXT // CACHED</span>
              </div>
              <span className="font-mono-tech text-[10px] text-[#00f0ff] font-bold">4.2 MB</span>
            </div>
            <p className="font-body text-xs text-[#dee2ed] font-medium leading-snug">
              Project Orion Briefing & Orbital Trajectory Telemetry
            </p>
            <span className="font-mono-tech text-[9px] text-[#b9cacb]">
              Confidence: 99.4% // Retrieved via Local Synapse
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
