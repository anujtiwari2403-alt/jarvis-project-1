import React, { useState } from 'react';
import { PairedNode } from '../types/assistant';

interface DiagnosticsViewProps {
  nodes: PairedNode[];
  onPurgeMemory: () => void;
  pairingCode: string;
  pairingNonce: string;
  onCalibrateAudio: () => void;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  nodes,
  onPurgeMemory,
  pairingCode,
  pairingNonce,
  onCalibrateAudio,
}) => {
  const [showQrReticle, setShowQrReticle] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [fsSandboxed, setFsSandboxed] = useState(true);
  const [noiseThreshold, setNoiseThreshold] = useState(-42);
  const [cameraState, setCameraState] = useState<'BLOCKED' | 'PROMPTING' | 'READY'>('BLOCKED');
  const [showPurgeModal, setShowPurgeModal] = useState(false);

  const handleTestAudio = () => {
    setCalibrating(true);
    onCalibrateAudio();
    setTimeout(() => {
      setCalibrating(false);
    }, 2000);
  };

  const handleRecalibrateCamera = () => {
    setCameraState('PROMPTING');
    setTimeout(() => {
      setCameraState('READY');
      setTimeout(() => setCameraState('BLOCKED'), 4000);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 py-2 gap-4 text-[#dee2ed] pb-28">
      {/* 1. Header Tactical Reticle Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#252a32]/60 backdrop-blur-xl p-4 border border-[#00f0ff]/20 shadow-lg flex flex-col gap-3">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#00f0ff]/10 blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] glow-dot"></span>
            <span className="font-mono-tech text-[10px] sm:text-xs text-[#62d5f2] tracking-widest uppercase font-bold">
              DIAGNOSTIC MATRIX // SYS.09
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#090e16]/80 px-2.5 py-0.5 rounded-full border border-[#00e599]/30">
            <span className="material-symbols-outlined text-[#00e599] text-[14px]">verified</span>
            <span className="font-mono-tech text-[9px] text-[#00e599] font-bold">INTEGRITY 100%</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg text-[#dee2ed] font-semibold tracking-tight">
              Diagnostics & Nodes
            </span>
            <span className="font-body text-xs text-[#b9cacb]">
              Active quantum-secured telemetry and sensory telemetry fabric
            </span>
          </div>

          {/* Tactical Reticle SVG */}
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full anim-spin-slow pointer-events-none" fill="none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="#62d5f2" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
              <circle cx="50" cy="50" r="34" stroke="#00f0ff" strokeWidth="2" strokeDasharray="14 10" opacity="0.6" />
              <circle cx="50" cy="50" r="22" stroke="#62d5f2" strokeWidth="1.5" />
              <line x1="50" y1="2" x2="50" y2="18" stroke="#00f0ff" strokeWidth="2.5" />
              <line x1="50" y1="82" x2="50" y2="98" stroke="#00f0ff" strokeWidth="2.5" />
              <line x1="2" y1="50" x2="18" y2="50" stroke="#00f0ff" strokeWidth="2.5" />
              <line x1="82" y1="50" x2="98" y2="50" stroke="#00f0ff" strokeWidth="2.5" />
            </svg>
            <div className="absolute w-3 h-3 rounded-full bg-[#00f0ff] glow-dot"></div>
          </div>
        </div>

        {/* Monospace Terminal Health Line */}
        <div className="bg-[#090e16]/90 rounded-lg p-2 flex items-center justify-between font-mono-tech text-[10px] text-[#b9cacb] overflow-x-auto border border-[#3b494b]/30">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[#00f0ff] font-bold">&gt;</span>
            <span className="text-[#62d5f2] font-semibold tracking-wide truncate">WS://NEXUS.CORE:443</span>
            <span className="text-[#3b494b]">|</span>
            <span className="text-[#dee2ed]">TLS 1.3 / ChaCha20</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-[#7df4ff] pl-2 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span>PING 8ms</span>
          </div>
        </div>
      </div>

      {/* 2. Hardware Telemetry & Latency Cards */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#62d5f2]">speed</span>
            <span className="font-mono-tech text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              HARDWARE TELEMETRY & LATENCY
            </span>
          </div>
          <span className="font-mono-tech text-[9px] text-[#adecff]">POLL: 60Hz</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Neural Latency */}
          <div className="bg-[#252a32]/40 rounded-xl p-3 border border-[#3b494b]/30 flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between text-[#b9cacb]">
              <span className="font-mono-tech text-[9px] uppercase font-bold">Neural Latency</span>
              <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">bolt</span>
            </div>
            <div className="my-2 flex items-baseline gap-1">
              <span className="font-display text-2xl text-[#dee2ed] font-bold">14</span>
              <span className="font-mono-tech text-[10px] text-[#62d5f2]">ms</span>
              <span className="ml-auto text-[8px] font-mono-tech px-1.5 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] font-bold">
                OPTIMAL
              </span>
            </div>
            <div className="flex gap-1 h-1.5 w-full mt-1">
              <div className="flex-1 rounded-full bg-[#00f0ff]"></div>
              <div className="flex-1 rounded-full bg-[#00f0ff]"></div>
              <div className="flex-1 rounded-full bg-[#00f0ff]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
            </div>
          </div>

          {/* Card 2: RAM Footprint */}
          <div className="bg-[#252a32]/40 rounded-xl p-3 border border-[#3b494b]/30 flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between text-[#b9cacb]">
              <span className="font-mono-tech text-[9px] uppercase font-bold">RAM Footprint</span>
              <span className="material-symbols-outlined text-[14px] text-[#62d5f2]">memory</span>
            </div>
            <div className="my-2 flex items-baseline gap-1">
              <span className="font-display text-2xl text-[#dee2ed] font-bold">218</span>
              <span className="font-mono-tech text-[10px] text-[#62d5f2]">MB</span>
              <span className="ml-auto text-[8px] font-mono-tech px-1.5 py-0.5 rounded-full bg-[#079eb9]/20 text-[#adecff] font-bold">
                / 4 GB
              </span>
            </div>
            <div className="flex gap-1 h-1.5 w-full mt-1">
              <div className="flex-1 rounded-full bg-[#62d5f2]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
            </div>
          </div>

          {/* Card 3: Packet Loss */}
          <div className="bg-[#252a32]/40 rounded-xl p-3 border border-[#3b494b]/30 flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between text-[#b9cacb]">
              <span className="font-mono-tech text-[9px] uppercase font-bold">Packet Drop</span>
              <span className="material-symbols-outlined text-[14px] text-[#7df4ff]">wifi_tethering</span>
            </div>
            <div className="my-2 flex items-baseline gap-1">
              <span className="font-display text-2xl text-[#dee2ed] font-bold">0.00</span>
              <span className="font-mono-tech text-[10px] text-[#62d5f2]">%</span>
              <span className="ml-auto text-[8px] font-mono-tech px-1.5 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] font-bold">
                ZERO-ERR
              </span>
            </div>
            <div className="flex gap-1 h-1.5 w-full mt-1">
              <div className="flex-1 rounded-full bg-[#00f0ff]"></div>
              <div className="flex-1 rounded-full bg-[#00f0ff]"></div>
              <div className="flex-1 rounded-full bg-[#00f0ff]"></div>
              <div className="flex-1 rounded-full bg-[#00f0ff]"></div>
              <div className="flex-1 rounded-full bg-[#00f0ff]"></div>
            </div>
          </div>

          {/* Card 4: Buffer Jitter */}
          <div className="bg-[#252a32]/40 rounded-xl p-3 border border-[#3b494b]/30 flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between text-[#b9cacb]">
              <span className="font-mono-tech text-[9px] uppercase font-bold">Buffer Jitter</span>
              <span className="material-symbols-outlined text-[14px] text-[#62d5f2]">graphic_eq</span>
            </div>
            <div className="my-2 flex items-baseline gap-1">
              <span className="font-display text-2xl text-[#dee2ed] font-bold">1.2</span>
              <span className="font-mono-tech text-[10px] text-[#62d5f2]">ms</span>
              <span className="ml-auto text-[8px] font-mono-tech px-1.5 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] font-bold">
                SYNCED
              </span>
            </div>
            <div className="flex gap-1 h-1.5 w-full mt-1">
              <div className="flex-1 rounded-full bg-[#00f0ff]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
              <div className="flex-1 rounded-full bg-[#30353d]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sensory Hardware & Access Policies */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#62d5f2]">security</span>
            <span className="font-mono-tech text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              SENSORY HARDWARE & ACCESS POLICIES
            </span>
          </div>
          <span className="font-mono-tech text-[10px] text-[#00f0ff] font-bold">4 ACTIVE</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Permission 1: Vocal Audio Feed */}
          <div className="bg-[#252a32]/40 rounded-xl p-3.5 border border-[#3b494b]/30 backdrop-blur-md flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#00f0ff]/15 flex items-center justify-center text-[#00f0ff] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-sm text-[#dee2ed] font-medium">Microphone & Vocal Feed</span>
                  <span className="font-mono-tech text-[9px] text-[#adecff]">GRANTED // Exclusive Raw 48kHz Stream</span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] glow-dot shrink-0 mt-1"></span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleTestAudio}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#30353d]/80 text-[#62d5f2] hover:bg-[#30353d] active:scale-95 transition-all text-[10px] font-mono-tech font-bold"
              >
                <span className="material-symbols-outlined text-[14px]">volume_up</span>
                <span>{calibrating ? 'TRANSMITTING CHIRP...' : 'CALIBRATE ECHO'}</span>
              </button>
              <span className="text-[10px] font-mono-tech text-[#00e599] font-bold">STATUS: OK</span>
            </div>
          </div>

          {/* Permission 2: Local Filesystem Access */}
          <div className="bg-[#252a32]/40 rounded-xl p-3.5 border border-[#3b494b]/30 backdrop-blur-md flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#079eb9]/20 flex items-center justify-center text-[#adecff] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">folder_managed</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-sm text-[#dee2ed] font-medium">Local Filesystem Boundary</span>
                  <span className="font-mono-tech text-[9px] text-[#b9cacb]">RESTRICTED // Sandboxed to /workspace/</span>
                </div>
              </div>

              {/* Interactive Toggle Switch */}
              <button
                onClick={() => setFsSandboxed(!fsSandboxed)}
                className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-all ${
                  fsSandboxed ? 'bg-[#079eb9]' : 'bg-[#30353d]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-[#05080d] transition-all transform ${
                    fsSandboxed ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between font-mono-tech text-[9px] text-[#b9cacb] bg-[#090e16]/60 px-2.5 py-1 rounded-lg">
              <span className="text-[#adecff]">Read-Write: /workspace/*</span>
              <span className="text-[#ffb4ab] font-bold">ROOT LOCKED</span>
            </div>
          </div>

          {/* Permission 3: External Web Synthesis */}
          <div className="bg-[#252a32]/40 rounded-xl p-3 border border-[#3b494b]/30 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#00f0ff]/15 flex items-center justify-center text-[#00f0ff] shrink-0">
                <span className="material-symbols-outlined text-[20px]">travel_explore</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm text-[#dee2ed] font-medium">External Web Synthesis</span>
                <span className="font-mono-tech text-[9px] text-[#adecff]">ENABLED // Zero-Telemetry Encrypted Proxy</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">check_circle</span>
          </div>

          {/* Permission 4: Camera Sensor State */}
          <div className="bg-[#252a32]/30 rounded-xl p-3 border border-[#3b494b]/20 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#93000a]/30 flex items-center justify-center text-[#ffb4ab] shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  {cameraState === 'READY' ? 'videocam' : 'videocam_off'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xs text-[#dee2ed] font-medium">Optic Sensor Video Stream</span>
                <span className="font-mono-tech text-[9px] text-[#ffb4ab]">
                  {cameraState === 'READY'
                    ? 'STREAM READY // PRIVILEGED'
                    : cameraState === 'PROMPTING'
                    ? 'PROMPTING OS FOR PERMISSION...'
                    : 'PERMISSION DENIED (USER_BLOCKED)'}
                </span>
              </div>
            </div>
            <button
              onClick={handleRecalibrateCamera}
              className="px-2.5 py-1 rounded-full bg-[#30353d] text-[#adecff] text-[9px] font-mono-tech font-bold active:scale-95 transition-all"
            >
              RE-CALIBRATE
            </button>
          </div>
        </div>
      </div>

      {/* 4. Secure Quantum Device Pairing & Active Nodes */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#62d5f2]">devices_other</span>
            <span className="font-mono-tech text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              SECURE NODE TOPOLOGY
            </span>
          </div>
          <span className="font-mono-tech text-[9px] text-[#adecff] font-bold">{nodes.length} PAIRED</span>
        </div>

        {/* Pairing Reticle Block */}
        <div className="bg-[#252a32]/40 rounded-xl p-4 border border-[#00f0ff]/20 backdrop-blur-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-display text-sm sm:text-base text-[#dee2ed] font-medium">
                Pair Android Phone / Compute Rig
              </span>
              <span className="font-body text-xs text-[#b9cacb]">
                Sync mobile neural model or ambient HUD
              </span>
            </div>
            <button
              onClick={() => setShowQrReticle(!showQrReticle)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00f0ff] text-[#00363a] font-mono-tech text-xs font-bold active:scale-95 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">
                {showQrReticle ? 'close' : 'qr_code_scanner'}
              </span>
              <span>{showQrReticle ? 'COLLAPSE' : 'PAIR NODE'}</span>
            </button>
          </div>

          {/* Holographic QR Code Box */}
          {showQrReticle && (
            <div className="flex flex-col items-center justify-center py-4 bg-[#090e16]/90 rounded-xl border border-[#00f0ff]/30 relative animate-fadeIn">
              <div className="relative w-44 h-44 flex items-center justify-center p-2 bg-[#171c23] rounded-lg">
                {/* Corner reticles */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#00f0ff]"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#00f0ff]"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff]"></div>

                {/* SVG Holographic QR Pattern */}
                <svg className="w-full h-full text-[#62d5f2]" fill="currentColor" viewBox="0 0 100 100">
                  <rect x="10" y="10" width="24" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="16" y="16" width="12" height="12" rx="1" fill="currentColor" />
                  <rect x="66" y="10" width="24" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="72" y="16" width="12" height="12" rx="1" fill="currentColor" />
                  <rect x="10" y="66" width="24" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="16" y="72" width="12" height="12" rx="1" fill="currentColor" />
                  <rect x="42" y="12" width="6" height="6" />
                  <rect x="52" y="12" width="6" height="6" />
                  <rect x="42" y="24" width="6" height="12" />
                  <rect x="12" y="42" width="6" height="6" />
                  <rect x="24" y="42" width="6" height="6" />
                  <rect x="36" y="42" width="12" height="6" />
                  <rect x="54" y="42" width="8" height="8" />
                  <rect x="70" y="42" width="6" height="16" />
                  <rect x="82" y="42" width="6" height="6" />
                  <rect x="42" y="56" width="6" height="14" />
                  <rect x="54" y="56" width="6" height="6" />
                  <rect x="66" y="66" width="10" height="6" />
                  <rect x="80" y="66" width="8" height="8" />
                  <rect x="42" y="76" width="14" height="6" />
                  <rect x="66" y="80" width="8" height="8" />
                  <rect x="80" y="80" width="8" height="8" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f0ff]/15 to-transparent animate-pulse pointer-events-none"></div>
              </div>

              <div className="mt-3 text-center">
                <span className="font-mono-tech text-xs text-[#00f0ff] tracking-widest font-bold uppercase block">
                  PIN CODE: {pairingCode}
                </span>
                <span className="font-mono-tech text-[10px] text-[#b9cacb] mt-0.5 block">
                  NONCE: {pairingNonce} (AES-256 ENCRYPTED)
                </span>
              </div>
            </div>
          )}

          {/* Active Nodes List */}
          <div className="flex flex-col gap-2 pt-1">
            {nodes.map((n) => (
              <div
                key={n.id}
                className="bg-[#090e16]/60 rounded-xl p-3 border border-[#3b494b]/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#252a32] flex items-center justify-center text-[#00f0ff]">
                    <span className="material-symbols-outlined text-[20px]">
                      {n.type === 'phone' ? 'smartphone' : 'laptop_mac'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-xs sm:text-sm text-[#dee2ed]">{n.name}</span>
                      <span className="text-[8px] font-mono-tech px-1.5 py-0.2 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] font-bold">
                        {n.status}
                      </span>
                    </div>
                    <span className="font-mono-tech text-[9px] text-[#b9cacb]">{n.ip} // {n.keyFingerprint}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-tech text-[9px] text-[#00e599] font-bold">SYNCED</span>
                  <span className="w-2 h-2 rounded-full bg-[#00e599] glow-dot"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Vocal Calibration & Wake Trigger */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#62d5f2]">record_voice_over</span>
            <span className="font-mono-tech text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              WAKE-WORD & BIOMETRICS
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono-tech text-[9px] text-[#00f0ff] font-bold">
            <span className="material-symbols-outlined text-[13px] text-[#00f0ff]">fingerprint</span>
            <span>VOICE MATCH: 98.6%</span>
          </div>
        </div>

        <div className="bg-[#252a32]/40 rounded-xl p-4 border border-[#3b494b]/30 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono-tech text-[9px] text-[#adecff] uppercase font-bold">Active Wake Trigger</span>
              <span className="font-display text-base text-[#dee2ed] font-bold">"Hey JARVIS" / "हे जार्विस"</span>
            </div>
            <div className="flex items-center gap-1 bg-[#00f0ff]/15 px-3 py-1 rounded-full text-[#00f0ff] font-mono-tech text-[10px] font-bold">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>BIOMETRIC LOCKED</span>
            </div>
          </div>

          {/* Ambient Noise Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono-tech text-[10px]">
              <span className="text-[#b9cacb]">AMBIENT NOISE SUPPRESSION THRESHOLD</span>
              <span className="text-[#62d5f2] font-bold">{noiseThreshold} dB</span>
            </div>
            <input
              type="range"
              min="-64"
              max="-12"
              value={noiseThreshold}
              onChange={(e) => setNoiseThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-[#00f0ff] bg-[#090e16] h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex items-center justify-between font-mono-tech text-[8px] text-[#849495]">
              <span>SENSITIVE (-12dB)</span>
              <span>TACTICAL FILTER (-64dB)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Zero-Persistence Security & Emergency Purge */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#62d5f2]">privacy_tip</span>
            <span className="font-mono-tech text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              PRIVACY & VOLATILITY CONTROLS
            </span>
          </div>
          <span className="font-mono-tech text-[9px] text-[#adecff]">ENCRYPTED</span>
        </div>

        <div className="bg-[#252a32]/40 rounded-xl p-4 border border-[#3b494b]/30 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col pr-2">
              <span className="font-display text-sm text-[#dee2ed] font-medium">Zero-Telemetry Policy</span>
              <span className="font-body text-xs text-[#b9cacb]">
                All vector embeddings wiped on termination. No external telemetry stored.
              </span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#079eb9]/20 text-[#adecff] font-mono-tech text-[10px] font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] glow-dot"></span>
              <span>ENFORCED</span>
            </div>
          </div>

          <div className="h-px w-full bg-[#3b494b]/40"></div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-display text-sm text-[#ffb4ab] font-medium">Purge Local Memory Cache</span>
              <span className="font-mono-tech text-[9px] text-[#b9cacb]">Immediate flush of RAM conversation buffers</span>
            </div>
            <button
              onClick={() => setShowPurgeModal(true)}
              className="px-4 py-1.5 rounded-full bg-[#93000a] text-[#ffdad6] font-mono-tech text-xs font-bold active:scale-95 transition-all shadow-md flex items-center gap-1 hover:bg-[#ffb4ab] hover:text-[#690005]"
            >
              <span className="material-symbols-outlined text-[15px]">delete_forever</span>
              <span>PURGE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0f141b] rounded-2xl border border-[#ff3b56]/40 shadow-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#ffb4ab]">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <span className="font-display font-semibold text-lg text-[#ffb4ab]">Confirm Volatile Memory Wipe</span>
            </div>
            <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
              This operation resets all cached context, current conversational states, and local scratchpad memory. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="px-4 py-1.5 rounded-lg font-mono-tech text-xs text-[#b9cacb] hover:bg-[#252a32]"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  onPurgeMemory();
                  setShowPurgeModal(false);
                }}
                className="px-4 py-1.5 rounded-lg font-mono-tech text-xs bg-[#93000a] text-[#ffdad6] font-bold hover:bg-[#ffb4ab] hover:text-[#690005] active:scale-95 transition-all"
              >
                EXECUTE PURGE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
