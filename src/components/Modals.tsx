import React, { useState } from 'react';

// ==========================================
// Note Creation Modal
// ==========================================
interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, tags: string[]) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('TACTICAL');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(title.trim() || content.slice(0, 30), content.trim(), [tag.toUpperCase()]);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0f141b] rounded-2xl border border-[#00f0ff]/30 shadow-2xl p-5 flex flex-col gap-4 relative">
        <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/40">
          <div className="flex items-center gap-2 text-[#00f0ff]">
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            <span className="font-display font-semibold text-lg text-[#dbfcff]">New Tactical Note</span>
          </div>
          <button onClick={onClose} className="text-[#b9cacb] hover:text-[#dbfcff]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="font-mono-tech text-[10px] text-[#62d5f2] block mb-1 uppercase">Note Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Workspace Architecture Refactor"
              className="w-full bg-[#171c23] border border-[#3b494b]/50 rounded-lg px-3 py-2 text-sm text-[#dee2ed] placeholder:text-[#849495] focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="font-mono-tech text-[10px] text-[#62d5f2] block mb-1 uppercase">Note Content</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Voice-to-markdown transcript or operational memo..."
              className="w-full bg-[#171c23] border border-[#3b494b]/50 rounded-lg px-3 py-2 text-sm text-[#dee2ed] placeholder:text-[#849495] focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="font-mono-tech text-[10px] text-[#62d5f2] block mb-1 uppercase">Category Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full bg-[#171c23] border border-[#3b494b]/50 rounded-lg px-3 py-2 text-xs font-mono-tech text-[#dee2ed] focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="TACTICAL">TACTICAL</option>
              <option value="DEV_CODE">DEV_CODE</option>
              <option value="RESEARCH">RESEARCH</option>
              <option value="PERSONAL">PERSONAL</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg font-mono-tech text-xs text-[#b9cacb] hover:bg-[#252a32]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg font-mono-tech text-xs bg-[#00f0ff] text-[#00363a] font-semibold hover:bg-[#dbfcff] active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
            >
              SAVE NOTE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// Reminder Creation Modal
// ==========================================
interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, time: string, priority: 'low' | 'medium' | 'high') => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('16:30');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), time, priority);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0f141b] rounded-2xl border border-[#00f0ff]/30 shadow-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/40">
          <div className="flex items-center gap-2 text-[#00f0ff]">
            <span className="material-symbols-outlined text-[20px]">timer</span>
            <span className="font-display font-semibold text-lg text-[#dbfcff]">Set Chrono Reminder</span>
          </div>
          <button onClick={onClose} className="text-[#b9cacb] hover:text-[#dbfcff]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="font-mono-tech text-[10px] text-[#62d5f2] block mb-1 uppercase">Reminder Directive</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Review orbital drone telemetry with team"
              className="w-full bg-[#171c23] border border-[#3b494b]/50 rounded-lg px-3 py-2 text-sm text-[#dee2ed] placeholder:text-[#849495] focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono-tech text-[10px] text-[#62d5f2] block mb-1 uppercase">Target Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="16:30 or 45M"
                className="w-full bg-[#171c23] border border-[#3b494b]/50 rounded-lg px-3 py-2 text-sm text-[#dee2ed] focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
            <div>
              <label className="font-mono-tech text-[10px] text-[#62d5f2] block mb-1 uppercase">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#171c23] border border-[#3b494b]/50 rounded-lg px-3 py-2 text-xs font-mono-tech text-[#dee2ed] focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="high">HIGH (TACTICAL)</option>
                <option value="medium">MEDIUM (STANDARD)</option>
                <option value="low">LOW (ROUTINE)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg font-mono-tech text-xs text-[#b9cacb] hover:bg-[#252a32]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg font-mono-tech text-xs bg-[#00f0ff] text-[#00363a] font-semibold hover:bg-[#dbfcff] active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
            >
              SCHEDULE REMINDER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// Launch App Selector Modal
// ==========================================
interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (appId: string) => void;
}

export const AppModal: React.FC<AppModalProps> = ({ isOpen, onClose, onLaunch }) => {
  if (!isOpen) return null;

  const apps = [
    { id: 'terminal', name: 'Terminal / PowerShell', icon: 'terminal', desc: 'Host command prompt & wt.exe' },
    { id: 'vscode', name: 'VS Code IDE', icon: 'code', desc: 'Code editor workspace' },
    { id: 'notepad', name: 'Notepad', icon: 'description', desc: 'Quick scratchpad memo' },
    { id: 'calculator', name: 'Calculator', icon: 'calculate', desc: 'Math execution' },
    { id: 'obsidian', name: 'Obsidian Notes', icon: 'auto_stories', desc: 'Knowledge graph vault' },
    { id: 'chrome', name: 'Google Chrome', icon: 'language', desc: 'Secure web navigation' },
    { id: 'spotify', name: 'Spotify Music', icon: 'music_note', desc: 'Audio media playback' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0f141b] rounded-2xl border border-[#00f0ff]/30 shadow-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/40">
          <div className="flex items-center gap-2 text-[#00f0ff]">
            <span className="material-symbols-outlined text-[20px]">apps</span>
            <span className="font-display font-semibold text-lg text-[#dbfcff]">Approved Applications</span>
          </div>
          <button onClick={onClose} className="text-[#b9cacb] hover:text-[#dbfcff]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="font-body text-xs text-[#b9cacb]">
          Select an authorized desktop application to spawn on host machine.
        </p>

        <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                onLaunch(app.id);
                onClose();
              }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#171c23] hover:bg-[#252a32] border border-[#3b494b]/30 hover:border-[#00f0ff]/40 text-left transition-all active:scale-[0.98]"
            >
              <div className="w-9 h-9 rounded-lg bg-[#252a32] flex items-center justify-center text-[#00f0ff] shrink-0">
                <span className="material-symbols-outlined text-[20px]">{app.icon}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-medium text-sm text-[#dee2ed]">{app.name}</span>
                <span className="font-mono-tech text-[10px] text-[#849495] truncate">{app.desc}</span>
              </div>
              <span className="material-symbols-outlined text-[#62d5f2] text-[16px] ml-auto">play_arrow</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Web Search Modal
// ==========================================
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
    setQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0f141b] rounded-2xl border border-[#00f0ff]/30 shadow-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/40">
          <div className="flex items-center gap-2 text-[#00f0ff]">
            <span className="material-symbols-outlined text-[20px]">travel_explore</span>
            <span className="font-display font-semibold text-lg text-[#dbfcff]">Web Intel Search</span>
          </div>
          <button onClick={onClose} className="text-[#b9cacb] hover:text-[#dbfcff]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type query to research on web..."
            className="w-full bg-[#171c23] border border-[#3b494b]/50 rounded-lg px-3 py-2.5 text-sm text-[#dee2ed] placeholder:text-[#849495] focus:outline-none focus:border-[#00f0ff]"
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg font-mono-tech text-xs text-[#b9cacb] hover:bg-[#252a32]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg font-mono-tech text-xs bg-[#00f0ff] text-[#00363a] font-semibold hover:bg-[#dbfcff] active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
            >
              SEARCH WEB
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// Memory Purge Confirmation Modal
// ==========================================
interface PurgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PurgeModal: React.FC<PurgeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0f141b] rounded-2xl border border-[#ff3b56]/40 shadow-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#ffb4ab]">
          <span className="material-symbols-outlined text-[24px]">warning</span>
          <span className="font-display font-semibold text-lg text-[#ffb4ab]">Confirm Volatile Memory Wipe</span>
        </div>
        <p className="font-body text-xs text-[#b9cacb] leading-relaxed">
          This operation resets all cached context, current conversational history, and local scratchpad memory. This cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-mono-tech text-xs text-[#b9cacb] hover:bg-[#252a32]"
          >
            CANCEL
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg font-mono-tech text-xs bg-[#93000a] text-[#ffdad6] font-bold hover:bg-[#ffb4ab] hover:text-[#690005] active:scale-95 transition-all shadow-[0_0_12px_rgba(255,59,86,0.3)]"
          >
            EXECUTE PURGE
          </button>
        </div>
      </div>
    </div>
  );
};
