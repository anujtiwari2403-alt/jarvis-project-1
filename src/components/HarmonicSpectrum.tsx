import React, { useState, useEffect } from 'react';

interface HarmonicSpectrumProps {
  isListening: boolean;
  isSpeaking: boolean;
  onInterrupt: () => void;
  onMuteToggle?: (muted: boolean) => void;
  barCount?: number;
}

export const HarmonicSpectrum: React.FC<HarmonicSpectrumProps> = ({
  isListening,
  isSpeaking,
  onInterrupt,
  onMuteToggle,
  barCount = 24,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [beamformingActive, setBeamformingActive] = useState(true);
  const [barHeights, setBarHeights] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => Math.floor(Math.random() * 40) + 15)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(() => {
        return Array.from({ length: barCount }, (_, i) => {
          if (isMuted) return 8;
          if (isSpeaking) {
            // High energy wave during speech output
            return Math.floor(Math.sin((Date.now() / 150) + i * 0.4) * 35) + 55;
          }
          if (isListening) {
            // Responsive ambient voice fluctuations
            return Math.floor(Math.random() * 65) + 25;
          }
          // Quiet background idle oscillation
          return Math.floor(Math.sin((Date.now() / 400) + i * 0.25) * 15) + 20;
        });
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isListening, isSpeaking, isMuted, barCount]);

  const handleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    onMuteToggle?.(next);
  };

  const handleBeamforming = () => {
    setBeamformingActive((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2 bg-[#171c23]/85 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-[#3b494b]/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">equalizer</span>
          <span className="font-mono-tech text-[10px] sm:text-xs text-[#dee2ed] uppercase tracking-wider font-semibold">
            HARMONIC SPECTRUM // {barCount}-CH
          </span>
        </div>
        <span className="font-mono-tech text-[10px] sm:text-xs text-[#62d5f2]">
          {isMuted ? 'MUTED (OFFLINE)' : '-18.4 dB (SNR 99.1%)'}
        </span>
      </div>

      {/* Dynamic Equalizer Bars */}
      <div className="flex items-end justify-between h-12 w-full px-1.5 py-1.5 bg-[#090e16]/80 rounded border border-[#3b494b]/20 gap-[2px] sm:gap-[3px] overflow-hidden">
        {barHeights.map((height, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-xs transition-all duration-100 ${
              isMuted
                ? 'bg-[#3b494b]/30'
                : 'bg-gradient-to-t from-[#079eb9] via-[#62d5f2] to-[#00f0ff] shadow-[0_0_6px_rgba(0,240,255,0.4)]'
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* Tactical Audio Control Buttons */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        <button
          onClick={handleMute}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-mono-tech text-[10px] sm:text-xs transition-all active:scale-95 ${
            isMuted
              ? 'bg-[#93000a]/50 text-[#ffb4ab] border border-[#ffb4ab]/30'
              : 'bg-[#1b2027] hover:bg-[#252a32] text-[#b9cacb] hover:text-[#dee2ed]'
          }`}
          title="Toggle Microphone mute"
        >
          <span className="material-symbols-outlined text-[15px] text-[#ffb4ab]">
            {isMuted ? 'mic' : 'mic_off'}
          </span>
          <span>{isMuted ? 'Unmute' : 'Mute Mic'}</span>
        </button>

        <button
          onClick={onInterrupt}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#1b2027] hover:bg-[#252a32] rounded font-mono-tech text-[10px] sm:text-xs text-[#62d5f2] hover:text-[#dbfcff] active:scale-95 transition-all"
          title="Interrupt speech output"
        >
          <span className="material-symbols-outlined text-[15px] text-[#62d5f2]">cancel</span>
          <span>Interrupt</span>
        </button>

        <button
          onClick={handleBeamforming}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-mono-tech text-[10px] sm:text-xs transition-all active:scale-95 ${
            beamformingActive
              ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'bg-[#1b2027] text-[#b9cacb]'
          }`}
          title="Spatial beamforming filtering"
        >
          <span className="material-symbols-outlined text-[15px]">sensors</span>
          <span>{beamformingActive ? 'ANC On' : 'Beamforming'}</span>
        </button>
      </div>
    </div>
  );
};
