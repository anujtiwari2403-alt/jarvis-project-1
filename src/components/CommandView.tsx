import React, { useState, useEffect } from 'react';
import { TaskItem, PairedNode } from '../types/assistant';

interface CommandViewProps {
  tasks: TaskItem[];
  nodes: PairedNode[];
  onOpenNoteModal: () => void;
  onOpenReminderModal: () => void;
  onOpenAppModal: () => void;
  onOpenSearchModal: () => void;
  onAbortTask: (taskId: string) => void;
  onRunScheduledTask: (taskId: string) => void;
  onExecuteCommand: (cmd: string) => void;
  onOpenDiagnostics: () => void;
}

export const CommandView: React.FC<CommandViewProps> = ({
  tasks,
  nodes,
  onOpenNoteModal,
  onOpenReminderModal,
  onOpenAppModal,
  onOpenSearchModal,
  onAbortTask,
  onRunScheduledTask,
  onExecuteCommand,
  onOpenDiagnostics,
}) => {
  const [atomicTime, setAtomicTime] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Millisecond precision atomic HUD clock
  useEffect(() => {
    let animId: number;
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, '0');
      setAtomicTime(`${h}:${m}:${s}.${ms}`);
      animId = requestAnimationFrame(updateTime);
    };
    updateTime();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onExecuteCommand(searchInput.trim());
    setSearchInput('');
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 py-2 gap-4 text-[#dee2ed] pb-28">
      {/* 1. Subsystems Telemetry Ticker */}
      <div className="relative overflow-hidden bg-[#090e16]/80 rounded-xl p-3 border border-[#00f0ff]/15 shadow-md">
        <div className="flex items-center justify-between text-[#62d5f2]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] glow-dot shrink-0"></span>
            <span className="font-mono-tech text-[10px] sm:text-xs tracking-wider text-[#dbfcff] truncate font-semibold">
              SUBSYSTEMS: 8/8 READY
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono-tech text-[10px] text-[#adecff]">REST: ONLINE</span>
            <span className="text-[#3b494b] font-mono-tech text-xs">|</span>
            <span className="font-mono-tech text-[10px] text-[#00f0ff] font-bold">WS: SYNCED</span>
          </div>
        </div>
      </div>

      {/* 2. Tactical HUD Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="bg-[#171c23]/90 rounded-xl p-1.5 flex items-center shadow-lg border border-[#3b494b]/40 focus-within:border-[#00f0ff] focus-within:shadow-[0_0_20px_rgba(0,240,255,0.18)] transition-all">
          <div className="w-9 h-9 rounded-lg bg-[#252a32]/80 flex items-center justify-center text-[#00f0ff] shrink-0">
            <span className="material-symbols-outlined text-[18px]">terminal</span>
          </div>
          <div className="flex-1 min-w-0 px-2.5">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="[ > Search protocols, apps, neural nodes... ]"
              className="w-full bg-transparent font-mono-tech text-xs text-[#00f0ff] placeholder:text-[#849495] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 pr-1 shrink-0">
            <span className="bg-[#30353d] px-1.5 py-0.5 rounded text-[#849495] font-mono-tech text-[9px]">⌘K</span>
            <button
              type="submit"
              className="w-8 h-8 rounded-lg bg-[#252a32] flex items-center justify-center text-[#62d5f2] hover:text-[#00f0ff] transition-colors"
              title="Execute search directive"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </form>

      {/* 3. Operational Core Status Reticle Banner */}
      <div className="relative bg-[#171c23]/70 rounded-xl p-3.5 border border-[#00f0ff]/20 shadow-md overflow-hidden hud-reticle-corner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full text-[#62d5f2] animate-pulse" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="14 8" opacity="0.4" />
                <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7" />
                <circle cx="50" cy="50" r="16" fill="currentColor" fillOpacity="0.15" />
              </svg>
              <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">radar</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-sm sm:text-base text-[#dee2ed] truncate">
                  NEXUS CORE HUD
                </span>
                <span className="bg-[#079eb9]/30 text-[#7df4ff] font-mono-tech text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  ACTIVE
                </span>
              </div>
              <span className="font-mono-tech text-[9px] sm:text-[10px] text-[#b9cacb] truncate">
                GEO: 37.7749° N, 122.4194° W // LOCAL ZENITH: 41.2°
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono-tech text-xs sm:text-sm text-[#00f0ff] tracking-wider font-bold">
              {atomicTime || '14:32:08.92'}
            </div>
            <span className="font-mono-tech text-[8px] sm:text-[9px] text-[#adecff]">UTC-0800 ATOMIC</span>
          </div>
        </div>
      </div>

      {/* 4. Quick-Action Tactical Grid (6 slots) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono-tech text-[10px] text-[#62d5f2] tracking-widest uppercase font-semibold">
            DIRECT ACTION DECK
          </span>
          <span className="font-mono-tech text-[9px] text-[#3b494b]">GRID // 06 SLOTS</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Tile 1: Approved Apps */}
          <div
            onClick={onOpenAppModal}
            className="group relative bg-[#171c23]/80 hover:bg-[#252a32]/90 rounded-xl p-3.5 border border-[#3b494b]/30 hover:border-[#00f0ff]/40 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#00f0ff] glow-dot"></div>
            <div className="flex flex-col h-full justify-between space-y-2">
              <div className="flex items-center gap-1.5 text-[#00f0ff]">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                <span className="font-mono-tech text-[9px] text-[#adecff] font-bold">APP_LAUNCH</span>
              </div>
              <div>
                <span className="font-display font-semibold text-sm text-[#dee2ed] block leading-tight">
                  Approved Apps
                </span>
                <span className="font-body text-[11px] text-[#b9cacb] line-clamp-1">Terminal, VS Code, Obsidian</span>
              </div>
              <div className="flex items-center gap-1 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#62d5f2]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#30353d]"></span>
                <span className="font-mono-tech text-[9px] text-[#b9cacb] ml-auto font-bold">7 APPS</span>
              </div>
            </div>
          </div>

          {/* Tile 2: Web Intel Search */}
          <div
            onClick={onOpenSearchModal}
            className="group relative bg-[#171c23]/80 hover:bg-[#252a32]/90 rounded-xl p-3.5 border border-[#3b494b]/30 hover:border-[#62d5f2]/40 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="absolute top-2 right-2 font-mono-tech text-[8px] text-[#62d5f2]">AI:SYNTH</div>
            <div className="flex flex-col h-full justify-between space-y-2">
              <div className="flex items-center gap-1.5 text-[#62d5f2]">
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                <span className="font-mono-tech text-[9px] text-[#adecff] font-bold">RESEARCH</span>
              </div>
              <div>
                <span className="font-display font-semibold text-sm text-[#dee2ed] block leading-tight">
                  Web Intel
                </span>
                <span className="font-body text-[11px] text-[#b9cacb] line-clamp-1">Multi-vector recursive engine</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono-tech text-[9px] text-[#adecff]">DEEP REASON</span>
                <span className="material-symbols-outlined text-[#00f0ff] text-[15px]">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* Tile 3: Tactical Note */}
          <div
            onClick={onOpenNoteModal}
            className="group relative bg-[#171c23]/80 hover:bg-[#252a32]/90 rounded-xl p-3.5 border border-[#3b494b]/30 hover:border-[#00f0ff]/40 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="flex flex-col h-full justify-between space-y-2">
              <div className="flex items-center gap-1.5 text-[#00f0ff]">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                <span className="font-mono-tech text-[9px] text-[#adecff] font-bold">ENCRYPTED</span>
              </div>
              <div>
                <span className="font-display font-semibold text-sm text-[#dee2ed] block leading-tight">
                  Tactical Note
                </span>
                <span className="font-body text-[11px] text-[#b9cacb] line-clamp-1">Voice-to-markdown buffer</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono-tech text-[9px] text-[#849495]">STT: RDY</span>
                <span className="material-symbols-outlined text-[#adecff] text-[15px]">mic</span>
              </div>
            </div>
          </div>

          {/* Tile 4: Set Reminder */}
          <div
            onClick={onOpenReminderModal}
            className="group relative bg-[#171c23]/80 hover:bg-[#252a32]/90 rounded-xl p-3.5 border border-[#3b494b]/30 hover:border-[#62d5f2]/40 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="flex flex-col h-full justify-between space-y-2">
              <div className="flex items-center gap-1.5 text-[#62d5f2]">
                <span className="material-symbols-outlined text-[18px]">timer</span>
                <span className="font-mono-tech text-[9px] text-[#adecff] font-bold">CHRONO</span>
              </div>
              <div>
                <span className="font-display font-semibold text-sm text-[#dee2ed] block leading-tight">
                  Set Reminder
                </span>
                <span className="font-body text-[11px] text-[#b9cacb] line-clamp-1">Mesh synchronized alarm</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono-tech text-[9px] text-[#00f0ff]">NEXT: 45M</span>
                <span className="material-symbols-outlined text-[#adecff] text-[15px]">add_circle</span>
              </div>
            </div>
          </div>

          {/* Tile 5: Astral Ephemeris */}
          <div
            onClick={() => onExecuteCommand('Jarvis, what is current orbital solar alignment?')}
            className="group relative bg-[#171c23]/80 hover:bg-[#252a32]/90 rounded-xl p-3.5 border border-[#3b494b]/30 hover:border-[#00f0ff]/40 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="flex flex-col h-full justify-between space-y-2">
              <div className="flex items-center gap-1.5 text-[#00f0ff]">
                <span className="material-symbols-outlined text-[18px]">explore</span>
                <span className="font-mono-tech text-[9px] text-[#adecff] font-bold">TELEMETRY</span>
              </div>
              <div>
                <span className="font-display font-semibold text-sm text-[#dee2ed] block leading-tight">
                  Astral Ephemeris
                </span>
                <span className="font-body text-[11px] text-[#b9cacb] line-clamp-1">Solar & orbital alignments</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono-tech text-[9px] text-[#adecff]">SOL: 99.4%</span>
                <span className="material-symbols-outlined text-[#00f0ff] text-[15px]">wb_sunny</span>
              </div>
            </div>
          </div>

          {/* Tile 6: Webhooks & Rules */}
          <div
            onClick={() => onExecuteCommand('Jarvis, list approved whitelisted domains')}
            className="group relative bg-[#171c23]/80 hover:bg-[#252a32]/90 rounded-xl p-3.5 border border-[#3b494b]/30 hover:border-[#62d5f2]/40 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="flex flex-col h-full justify-between space-y-2">
              <div className="flex items-center gap-1.5 text-[#62d5f2]">
                <span className="material-symbols-outlined text-[18px]">api</span>
                <span className="font-mono-tech text-[9px] text-[#adecff] font-bold">GATEWAY</span>
              </div>
              <div>
                <span className="font-display font-semibold text-sm text-[#dee2ed] block leading-tight">
                  Webhooks & Rules
                </span>
                <span className="font-body text-[11px] text-[#b9cacb] line-clamp-1">12 Whitelisted domains</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono-tech text-[9px] text-[#00f0ff]">ZERO-FAIL</span>
                <span className="material-symbols-outlined text-[#62d5f2] text-[15px]">security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Tasks & Execution Queue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono-tech text-[10px] text-[#62d5f2] tracking-widest uppercase font-semibold">
              TASK EXECUTION QUEUE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#62d5f2] glow-dot"></span>
          </div>
          <span className="font-mono-tech text-[9px] text-[#849495]">AUTO-POLL: 500ms</span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#171c23]/85 rounded-xl p-3 border border-[#3b494b]/30 shadow-sm space-y-1.5"
            >
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  {task.status === 'COMPLETED' ? (
                    <span className="material-symbols-outlined text-[16px] text-[#00e599] shrink-0">check_circle</span>
                  ) : task.status === 'RUNNING' ? (
                    <span className="material-symbols-outlined text-[16px] text-[#00f0ff] animate-spin shrink-0">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px] text-[#849495] shrink-0">schedule</span>
                  )}
                  <span className="font-display font-medium text-xs sm:text-sm text-[#dee2ed] truncate">
                    {task.name}
                  </span>
                </div>
                <div
                  className={`px-2 py-0.5 rounded font-mono-tech text-[9px] font-bold shrink-0 ${
                    task.status === 'COMPLETED'
                      ? 'bg-[#00e599]/15 text-[#00e599]'
                      : task.status === 'RUNNING'
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                      : 'bg-[#30353d] text-[#849495]'
                  }`}
                >
                  {task.status === 'COMPLETED'
                    ? `COMPLETED (${task.duration || '0.8s'})`
                    : task.status === 'RUNNING'
                    ? `RUNNING // ${task.progress || 74}%`
                    : task.timestamp}
                </div>
              </div>

              {task.status === 'RUNNING' && (
                <div className="w-full bg-[#30353d] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#00f0ff] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#00f0ff]"
                    style={{ width: `${task.progress || 74}%` }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between font-mono-tech text-[9px] text-[#b9cacb] pt-0.5">
                <span className="truncate">{task.details}</span>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {task.status === 'RUNNING' ? (
                    <button
                      onClick={() => onAbortTask(task.id)}
                      className="text-[#ffb4ab] hover:underline"
                    >
                      ABORT
                    </button>
                  ) : task.status === 'SCHEDULED' ? (
                    <button
                      onClick={() => onRunScheduledTask(task.id)}
                      className="text-[#62d5f2] hover:text-[#00f0ff]"
                    >
                      RUN NOW
                    </button>
                  ) : (
                    <button
                      onClick={() => onExecuteCommand(`Inspect task ${task.name}`)}
                      className="hover:text-[#00f0ff]"
                    >
                      INSPECT
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Paired Ecosystem Nodes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono-tech text-[10px] text-[#62d5f2] tracking-widest uppercase font-semibold">
            PAIRED ECOSYSTEM NODES
          </span>
          <span className="font-mono-tech text-[9px] text-[#00f0ff] font-bold">
            {nodes.length}/{nodes.length} LINKED
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="flex items-center justify-between bg-[#171c23]/70 rounded-xl p-3 border border-[#3b494b]/30 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#252a32] flex items-center justify-center text-[#00f0ff] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    {node.type === 'phone' ? 'smartphone' : node.type === 'server' ? 'dns' : 'laptop_mac'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-medium text-xs sm:text-sm text-[#dee2ed] truncate">
                      {node.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] glow-dot"></span>
                  </div>
                  <span className="font-mono-tech text-[9px] text-[#b9cacb] truncate">
                    {node.ip} // {node.keyFingerprint}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono-tech text-[10px] text-[#00f0ff] font-bold block">
                  {node.status}
                </span>
                <span className="font-mono-tech text-[9px] text-[#b9cacb]">
                  {node.battery ? `BAT: ${node.battery}%` : 'LATENCY: 4ms'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Diagnostic Shell Trigger */}
      <div className="pt-1">
        <button
          onClick={onOpenDiagnostics}
          className="w-full py-3 bg-[#252a32]/60 hover:bg-[#30353d]/80 rounded-xl flex items-center justify-center gap-2 text-[#adecff] transition-all active:scale-[0.99] border border-[#3b494b]/30"
        >
          <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">terminal</span>
          <span className="font-mono-tech text-xs tracking-wider uppercase font-semibold">
            Open Diagnostic Shell (TTY-0)
          </span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
