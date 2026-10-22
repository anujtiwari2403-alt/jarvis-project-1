export type AssistantState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'OFFLINE' | 'ERROR';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  name: string;
  status: 'COMPLETED' | 'RUNNING' | 'SCHEDULED' | 'FAILED';
  progress?: number;
  duration?: string;
  details: string;
  target: string;
  timestamp: string;
}

export interface PairedNode {
  id: string;
  name: string;
  ip: string;
  type: 'laptop' | 'phone' | 'server' | 'mic';
  status: 'ONLINE' | 'STANDBY' | 'SYNCED' | 'DISCONNECTED';
  battery?: number;
  cpu?: number;
  keyFingerprint: string;
  lastSeen: string;
}

export interface TelemetryData {
  cpuLoad: string;
  vramBuffer: string;
  packetLoss: string;
  thermal: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  speakText?: string;
  timestamp: string;
  confidence?: number;
  reasoningTrace?: string[];
  telemetry?: TelemetryData;
  action?: {
    type: string;
    url?: string;
    app?: any;
    note?: any;
    reminder?: any;
    time?: string;
    date?: string;
  };
}
