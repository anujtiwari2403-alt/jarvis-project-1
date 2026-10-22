import React from 'react';
import { AssistantState, ChatMessage } from '../types/assistant';
import { AiReactor } from './AiReactor';
import { HarmonicSpectrum } from './HarmonicSpectrum';
import { TranscriptView } from './TranscriptView';

interface DesktopCockpitViewProps {
  assistantState: AssistantState;
  onStateSelect: (state: AssistantState) => void;
  messages: ChatMessage[];
  interimTranscript: string;
  onSendMessage: (text: string) => void;
  onVoiceTrigger: () => void;
  onInterrupt: () => void;
  onPlaySpeech: (text: string) => void;
  onClearHistory: () => void;
  errorMessage?: string | null;
  onOpenNoteModal: () => void;
  onOpenReminderModal: () => void;
  onOpenAppModal: () => void;
  onOpenSearchModal: () => void;
}

export const DesktopCockpitView: React.FC<DesktopCockpitViewProps> = ({
  assistantState,
  onStateSelect,
  messages,
  interimTranscript,
  onSendMessage,
  onVoiceTrigger,
  onInterrupt,
  onPlaySpeech,
  onClearHistory,
  errorMessage,
  onOpenNoteModal,
  onOpenReminderModal,
  onOpenAppModal,
  onOpenSearchModal,
}) => {
  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 py-4 pb-24">
      {/* 2-Column Responsive Cockpit Grid (Centered AI Core on Left/Center, Clean Transcript on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT / CENTER STAGE: The Holographic AI Core (Span 7)     */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col items-center gap-4">
          {/* Main AI Core Card */}
          <div className="w-full bg-[#080d14]/85 backdrop-blur-2xl rounded-2xl border border-[#00f0ff]/15 p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            {/* Corner Reticle Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]/40"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#00f0ff]/40"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#00f0ff]/40"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff]/40"></div>

            {/* AI Core Reactor */}
            <AiReactor
              state={assistantState}
              onStateSelect={onStateSelect}
              interimTranscript={interimTranscript}
              onMicClick={onVoiceTrigger}
            />

            {/* Quick Tactical Prompt Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-[#3b494b]/20 w-full">
              <button
                onClick={() => onSendMessage('What time is it?')}
                className="px-3 py-1 rounded-full bg-[#171c23] hover:bg-[#252a32] text-[#849495] hover:text-[#00f0ff] font-mono-tech text-[10px] transition-all border border-[#3b494b]/30"
              >
                + CURRENT TIME
              </button>
              <button
                onClick={() => onSendMessage('Open YouTube')}
                className="px-3 py-1 rounded-full bg-[#171c23] hover:bg-[#252a32] text-[#849495] hover:text-[#00f0ff] font-mono-tech text-[10px] transition-all border border-[#3b494b]/30"
              >
                + OPEN YOUTUBE
              </button>
              <button
                onClick={() => onSendMessage('Launch Terminal')}
                className="px-3 py-1 rounded-full bg-[#171c23] hover:bg-[#252a32] text-[#849495] hover:text-[#00f0ff] font-mono-tech text-[10px] transition-all border border-[#3b494b]/30"
              >
                + LAUNCH TERMINAL
              </button>
              <button
                onClick={onOpenNoteModal}
                className="px-3 py-1 rounded-full bg-[#171c23] hover:bg-[#252a32] text-[#849495] hover:text-[#00f0ff] font-mono-tech text-[10px] transition-all border border-[#3b494b]/30"
              >
                + NEW NOTE
              </button>
              <button
                onClick={onOpenReminderModal}
                className="px-3 py-1 rounded-full bg-[#171c23] hover:bg-[#252a32] text-[#849495] hover:text-[#00f0ff] font-mono-tech text-[10px] transition-all border border-[#3b494b]/30"
              >
                + SET REMINDER
              </button>
            </div>
          </div>

          {/* Harmonic Spectrum Visualizer */}
          <div className="w-full">
            <HarmonicSpectrum
              isListening={assistantState === 'LISTENING'}
              isSpeaking={assistantState === 'SPEAKING'}
              onInterrupt={onInterrupt}
              barCount={24}
            />
          </div>

          {/* Quick Skill Action Deck */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={onOpenAppModal}
              className="p-3 bg-[#0d1726]/80 hover:bg-[#171c23] rounded-xl border border-[#3b494b]/30 hover:border-[#00f0ff]/40 transition-all text-left flex flex-col gap-1 shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-[#00f0ff]">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                <span className="font-mono-tech text-[9px] uppercase font-bold">APPS</span>
              </div>
              <span className="font-display font-medium text-xs text-[#dee2ed]">Approved Apps</span>
              <span className="font-mono-tech text-[8px] text-[#849495]">Terminal, Code, Calc</span>
            </button>

            <button
              onClick={onOpenSearchModal}
              className="p-3 bg-[#0d1726]/80 hover:bg-[#171c23] rounded-xl border border-[#3b494b]/30 hover:border-[#62d5f2]/40 transition-all text-left flex flex-col gap-1 shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-[#62d5f2]">
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                <span className="font-mono-tech text-[9px] uppercase font-bold">SEARCH</span>
              </div>
              <span className="font-display font-medium text-xs text-[#dee2ed]">Web Intel</span>
              <span className="font-mono-tech text-[8px] text-[#849495]">Google Search</span>
            </button>

            <button
              onClick={onOpenNoteModal}
              className="p-3 bg-[#0d1726]/80 hover:bg-[#171c23] rounded-xl border border-[#3b494b]/30 hover:border-[#00f0ff]/40 transition-all text-left flex flex-col gap-1 shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-[#00f0ff]">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                <span className="font-mono-tech text-[9px] uppercase font-bold">MEMORY</span>
              </div>
              <span className="font-display font-medium text-xs text-[#dee2ed]">Tactical Note</span>
              <span className="font-mono-tech text-[8px] text-[#849495]">Local storage</span>
            </button>

            <button
              onClick={() => onSendMessage('System status')}
              className="p-3 bg-[#0d1726]/80 hover:bg-[#171c23] rounded-xl border border-[#3b494b]/30 hover:border-[#00e599]/40 transition-all text-left flex flex-col gap-1 shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-[#00e599]">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="font-mono-tech text-[9px] uppercase font-bold">DIAGNOSTICS</span>
              </div>
              <span className="font-display font-medium text-xs text-[#dee2ed]">System Health</span>
              <span className="font-mono-tech text-[8px] text-[#849495]">14ms // 0% drop</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT STAGE: Clean Conversation Transcript (Span 5)       */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 w-full h-[640px] sticky top-20">
          <TranscriptView
            messages={messages}
            assistantState={assistantState}
            onPlaySpeech={onPlaySpeech}
            onClearHistory={onClearHistory}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </div>
  );
};
