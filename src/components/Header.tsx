import React from 'react';
import { AssistantState } from '../types/assistant';

interface HeaderProps {
  assistantState: AssistantState;
  voiceMode: 'push-to-talk' | 'wake-word';
  onToggleVoiceMode: () => void;
  language: string;
  onChangeLanguage: (lang: string) => void;
  onOpenNotes: () => void;
  onOpenReminders: () => void;
  onOpenApps: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  assistantState,
  voiceMode,
  onToggleVoiceMode,
  language,
  onChangeLanguage,
  onOpenNotes,
  onOpenReminders,
  onOpenApps,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#080d14]/90 backdrop-blur-xl border-b border-[#00f0ff]/15">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#171c23] border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <span className="material-symbols-outlined text-[18px]">neurology</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm sm:text-base text-[#dbfcff] tracking-wider leading-none">
              JARVIS NEXUS
            </span>
            <span className="font-mono-tech text-[9px] text-[#62d5f2] tracking-widest leading-none mt-1">
              OS v4.2 // SYNAPSE
            </span>
          </div>
        </div>

        {/* Center: Real Connection & Mode Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Connection Status */}
          <div className="flex items-center gap-2 bg-[#171c23]/80 px-3 py-1 rounded-full border border-[#3b494b]/30">
            <span className={`w-2 h-2 rounded-full ${
              assistantState === 'ERROR' ? 'bg-[#ff3b56]' :
              assistantState === 'LISTENING' ? 'bg-[#00e599] animate-ping' :
              assistantState === 'THINKING' ? 'bg-[#ffb020] animate-pulse' :
              assistantState === 'SPEAKING' ? 'bg-[#00f0ff] animate-ping' : 'bg-[#00e599]'
            }`}></span>
            <span className="font-mono-tech text-[10px] text-[#dee2ed]">ws://synced</span>
            <span className="text-[#3b494b] font-mono-tech">•</span>
            <span className="font-mono-tech text-[10px] text-[#849495]">14ms</span>
          </div>

          {/* Voice Mode Toggle (PTT vs Wake Word) */}
          <button
            onClick={onToggleVoiceMode}
            className={`px-3 py-1 rounded-full font-mono-tech text-[10px] tracking-wider font-semibold transition-all border ${
              voiceMode === 'push-to-talk'
                ? 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/40'
                : 'bg-[#62d5f2]/15 text-[#62d5f2] border-[#62d5f2]/40'
            }`}
            title="Toggle between Push-to-Talk and 'Hey Jarvis' Wake Word"
          >
            {voiceMode === 'push-to-talk' ? 'MODE: PUSH-TO-TALK [SPACE]' : 'MODE: WAKE-WORD [HEY JARVIS]'}
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#171c23]/80 p-0.5 rounded-full border border-[#3b494b]/30 font-mono-tech text-[9px]">
            <button
              onClick={() => onChangeLanguage('en-US')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === 'en-US' ? 'bg-[#00f0ff] text-[#05080d] font-bold' : 'text-[#849495] hover:text-[#dee2ed]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onChangeLanguage('hi-IN')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === 'hi-IN' ? 'bg-[#00f0ff] text-[#05080d] font-bold' : 'text-[#849495] hover:text-[#dee2ed]'
              }`}
            >
              HI
            </button>
            <button
              onClick={() => onChangeLanguage('en-IN')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === 'en-IN' ? 'bg-[#00f0ff] text-[#05080d] font-bold' : 'text-[#849495] hover:text-[#dee2ed]'
              }`}
            >
              HINGLISH
            </button>
          </div>
        </div>

        {/* Right: Quick Skill Drawers */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenNotes}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#171c23] hover:bg-[#252a32] text-[#849495] hover:text-[#00f0ff] border border-[#3b494b]/30 font-mono-tech text-[10px] transition-all"
            title="View & Create Local Notes"
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span className="hidden sm:inline">NOTES</span>
          </button>

          <button
            onClick={onOpenReminders}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#171c23] hover:bg-[#252a32] text-[#849495] hover:text-[#00f0ff] border border-[#3b494b]/30 font-mono-tech text-[10px] transition-all"
            title="View & Set Reminders"
          >
            <span className="material-symbols-outlined text-[15px]">timer</span>
            <span className="hidden sm:inline">REMINDERS</span>
          </button>

          <button
            onClick={onOpenApps}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#171c23] hover:bg-[#252a32] text-[#849495] hover:text-[#00f0ff] border border-[#3b494b]/30 font-mono-tech text-[10px] transition-all"
            title="Launch Approved Apps"
          >
            <span className="material-symbols-outlined text-[15px]">apps</span>
            <span className="hidden sm:inline">APPS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
