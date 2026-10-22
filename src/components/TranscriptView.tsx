import React, { useRef, useEffect } from 'react';
import { ChatMessage, AssistantState } from '../types/assistant';

interface TranscriptViewProps {
  messages: ChatMessage[];
  assistantState: AssistantState;
  onPlaySpeech: (text: string) => void;
  onClearHistory: () => void;
  errorMessage?: string | null;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  messages,
  assistantState,
  onPlaySpeech,
  onClearHistory,
  errorMessage,
}) => {
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantState]);

  return (
    <div className="flex flex-col h-full bg-[#080d14]/90 backdrop-blur-xl rounded-2xl border border-[#00f0ff]/15 shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#3b494b]/30 bg-[#0d1726]/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">forum</span>
          <span className="font-display font-semibold text-xs text-[#dbfcff] tracking-wider uppercase">
            Cognitive Stream
          </span>
          <span className="font-mono-tech text-[9px] text-[#849495] bg-[#171c23] px-2 py-0.5 rounded-full">
            {messages.length} Directives
          </span>
        </div>

        <button
          onClick={onClearHistory}
          className="text-[#849495] hover:text-[#ffb4ab] text-[10px] font-mono-tech transition-colors"
          title="Clear conversation view"
        >
          CLEAR
        </button>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center text-[#849495] gap-2">
            <span className="material-symbols-outlined text-[32px] text-[#3b494b]">record_voice_over</span>
            <p className="font-body text-xs max-w-xs">
              No directives yet. Press [Spacebar] or tap the microphone to speak your command.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex flex-col items-end gap-1 ml-6">
                <div className="flex items-center gap-2 pr-1 font-mono-tech text-[9px] text-[#849495]">
                  <span>OPERATOR</span>
                  <span>{msg.timestamp}</span>
                  {msg.confidence !== undefined && (
                    <span className="text-[#00f0ff] bg-[#171c23] px-1.5 py-0.2 rounded font-bold">
                      {Math.round(msg.confidence * 100)}% MATCH
                    </span>
                  )}
                </div>
                <div className="bg-[#171c23] border border-[#3b494b]/40 rounded-2xl rounded-tr-none px-3.5 py-2.5 text-sm text-[#dee2ed] shadow-sm max-w-full break-words">
                  "{msg.text}"
                </div>
              </div>
            );
          }

          // Assistant message
          return (
            <div key={msg.id} className="flex flex-col items-start gap-1 mr-4">
              <div className="flex items-center gap-2 pl-1 font-mono-tech text-[9px] text-[#849495]">
                <span className="text-[#00f0ff] font-bold">JARVIS</span>
                <span>{msg.timestamp}</span>
                {msg.action?.type && (
                  <span className="text-[#62d5f2] bg-[#171c23] px-1.5 py-0.2 rounded font-bold">
                    {msg.action.type}
                  </span>
                )}
              </div>

              <div className="bg-[#0d1726] border border-[#00f0ff]/20 rounded-2xl rounded-tl-none p-3.5 text-sm text-[#dee2ed] shadow-md flex flex-col gap-2 max-w-full">
                <p className="font-body leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Reasoning trace if present */}
                {msg.reasoningTrace && msg.reasoningTrace.length > 0 && (
                  <div className="bg-[#080d14]/80 rounded-lg p-2 border border-[#3b494b]/20 font-mono-tech text-[9px] text-[#849495] space-y-0.5">
                    {msg.reasoningTrace.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[#adecff]/80">
                        <span className="text-[#00f0ff]">›</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Audio replay button */}
                <div className="flex items-center justify-between pt-1 border-t border-[#3b494b]/20">
                  <span className="font-mono-tech text-[8px] text-[#849495]">VOX OUTPUT: 48kHz</span>
                  <button
                    onClick={() => onPlaySpeech(msg.speakText || msg.text)}
                    className="flex items-center gap-1 text-[#62d5f2] hover:text-[#00f0ff] font-mono-tech text-[9px] transition-colors"
                    title="Speak response aloud"
                  >
                    <span className="material-symbols-outlined text-[13px]">volume_up</span>
                    <span>REPLAY</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Processing Indicator */}
        {assistantState === 'THINKING' && (
          <div className="flex items-center gap-2 p-3 bg-[#0d1726]/70 rounded-xl border border-[#ffb020]/30 animate-pulse">
            <span className="material-symbols-outlined text-[16px] text-[#ffb020] animate-spin">cyclone</span>
            <span className="font-mono-tech text-xs text-[#ffb020]">
              Processing command & synthesizing response...
            </span>
          </div>
        )}

        {/* Real Error Notification Banner */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-[#93000a]/20 border border-[#ff3b56]/40 rounded-xl text-[#ffb4ab] text-xs font-mono-tech">
            <span className="material-symbols-outlined text-[16px] text-[#ff3b56]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>
    </div>
  );
};
