import React, { useState } from 'react';
import { AssistantState } from '../types/assistant';

interface BottomThumbBarProps {
  assistantState: AssistantState;
  isListening: boolean;
  isMuted: boolean;
  onToggleMic: () => void;
  onToggleMute: () => void;
  onInterrupt: () => void;
  onSendCommand: (cmd: string) => void;
  confidence?: number;
}

export const BottomThumbBar: React.FC<BottomThumbBarProps> = ({
  assistantState,
  isListening,
  isMuted,
  onToggleMic,
  onToggleMute,
  onInterrupt,
  onSendCommand,
  confidence = 0.98,
}) => {
  const [textInput, setTextInput] = useState('');

  const isBusy = assistantState === 'THINKING';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isBusy) return;
    onSendCommand(textInput.trim());
    setTextInput('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 sm:h-20 bg-[#080d14]/95 backdrop-blur-2xl border-t border-[#00f0ff]/15 px-4 sm:px-6 shadow-[0_-2px_24px_rgba(0,0,0,0.8)]">
      <div className="h-full max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Vox State & Level Readout */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <div className="flex items-center gap-2 bg-[#171c23] px-3 py-1.5 rounded-lg border border-[#3b494b]/30">
            <span
              className={`w-2 h-2 rounded-full ${
                isListening
                  ? 'bg-[#00e599] animate-ping'
                  : assistantState === 'SPEAKING'
                  ? 'bg-[#00f0ff] animate-ping'
                  : isMuted
                  ? 'bg-[#ff3b56]'
                  : 'bg-[#00f0ff] glow-dot'
              }`}
            ></span>
            <span className="font-mono-tech text-[10px] text-[#dbfcff] font-bold uppercase tracking-wider">
              {isMuted ? 'VOX: MUTED' : isListening ? 'VOX: LISTENING' : assistantState === 'SPEAKING' ? 'VOX: SPEAKING' : 'VOX: READY'}
            </span>
          </div>

          {/* Equalizer animation */}
          <div className="hidden md:flex items-center gap-[2px] h-4 w-12 px-1 justify-center bg-[#171c23]/60 rounded">
            <div className={`w-[2px] bg-[#00f0ff] rounded-full ${isListening || assistantState === 'SPEAKING' ? 'animate-bounce' : 'h-1.5'}`}></div>
            <div className={`w-[2px] bg-[#62d5f2] rounded-full ${isListening || assistantState === 'SPEAKING' ? 'animate-bounce delay-75' : 'h-3'}`}></div>
            <div className={`w-[2px] bg-[#7df4ff] rounded-full ${isListening || assistantState === 'SPEAKING' ? 'animate-bounce delay-150' : 'h-2'}`}></div>
            <div className={`w-[2px] bg-[#079eb9] rounded-full ${isListening || assistantState === 'SPEAKING' ? 'animate-bounce delay-100' : 'h-1'}`}></div>
          </div>

          <span className="hidden lg:inline font-mono-tech text-[9px] text-[#849495]">
            STT // CONFIDENCE: {confidence.toFixed(3)}
          </span>
        </div>

        {/* Center: Push-to-Talk Mic & HALT Stop Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Main Glowing Push-To-Talk Button */}
          <button
            onClick={onToggleMic}
            className={`h-11 sm:h-12 px-4 sm:px-6 rounded-full font-display font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
              isListening
                ? 'bg-[#ff3b56] text-white shadow-[0_0_24px_#ff3b56] animate-pulse'
                : 'bg-[#00f0ff] text-[#05080d] hover:bg-[#dbfcff] shadow-[0_0_20px_rgba(0,240,255,0.4)]'
            }`}
            title="Press to Speak (or hold Spacebar)"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isListening ? 'mic_off' : 'mic'}
            </span>
            <span>{isListening ? 'STOP LISTENING' : 'HOLD / TAP TO TALK'}</span>
          </button>

          {/* Red Emergency HALT / Interrupt Button */}
          <button
            onClick={onInterrupt}
            className="h-10 sm:h-11 px-3 sm:px-4 rounded-full bg-[#93000a]/80 hover:bg-[#93000a] text-[#ffdad6] font-display text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all border border-[#ff3b56]/30 shadow-[0_0_12px_rgba(255,59,86,0.3)]"
            title="Immediately halt active speech and reset state"
          >
            <span className="material-symbols-outlined text-[16px]">stop_circle</span>
            <span>HALT</span>
          </button>
        </div>

        {/* Right: Text Command Input Field & Mute */}
        <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
          <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-[#171c23] rounded-xl px-3 py-1.5 border border-[#3b494b]/40 focus-within:border-[#00f0ff] focus-within:shadow-[0_0_16px_rgba(0,240,255,0.2)] transition-all">
            <span className="font-mono-tech text-xs text-[#00f0ff] font-bold mr-2 select-none">&gt;</span>
            <input
              type="text"
              disabled={isBusy}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={isBusy ? 'Processing directive...' : 'Type directive or query...'}
              className="w-full bg-transparent text-xs sm:text-sm text-[#dee2ed] placeholder:text-[#849495] font-mono-tech focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isBusy || !textInput.trim()}
              className="p-1 text-[#00f0ff] hover:text-[#dbfcff] disabled:opacity-30 transition-colors ml-1"
              title="Submit command"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isBusy ? 'sync' : 'arrow_upward'}
              </span>
            </button>
          </form>

          {/* Mute Mic Button */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl transition-all border ${
              isMuted
                ? 'bg-[#93000a]/30 text-[#ffb4ab] border-[#ff3b56]/40'
                : 'bg-[#171c23] text-[#849495] hover:text-[#dee2ed] border-[#3b494b]/30'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMuted ? 'mic_off' : 'volume_up'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
