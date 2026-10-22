/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AssistantState, ChatMessage, TaskItem, PairedNode } from './types/assistant';
import { voiceService } from './services/voiceService';
import { Header } from './components/Header';
import { DesktopCockpitView } from './components/DesktopCockpitView';
import { BottomThumbBar } from './components/BottomThumbBar';
import { NoteModal, ReminderModal, AppModal, SearchModal } from './components/Modals';
import { sendCommand, createNote, createReminder, setServerState } from './services/apiClient';

export default function App() {
  const [assistantState, setAssistantState] = useState<AssistantState>('IDLE');
  const [voiceMode, setVoiceMode] = useState<'push-to-talk' | 'wake-word'>('push-to-talk');
  const [language, setLanguage] = useState<string>('en-US');
  const [isMuted, setIsMuted] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'jarvis',
      text: 'JARVIS NEXUS core initialized. All local deterministic skills are operational, Sir. Press [Spacebar] or tap the microphone to issue a directive.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Modals state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  // Setup WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'INIT_SNAPSHOT') {
            if (msg.payload.conversationLog && msg.payload.conversationLog.length > 0) {
              setMessages(msg.payload.conversationLog);
            }
          } else if (msg.type === 'STATE_CHANGED') {
            setAssistantState(msg.payload.state);
          }
        } catch (e) {
          console.warn('WS message error:', e);
        }
      };
    } catch (e) {
      console.warn('WS connection failed:', e);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Initialize Voice Service Callbacks
  useEffect(() => {
    voiceService.registerCallbacks({
      onStateChange: (st) => {
        setAssistantState(st);
      },
      onInterim: (text) => {
        setInterimTranscript(text);
      },
      onFinalCommand: (cmd, confidence) => {
        setInterimTranscript('');
        handleSendCommand(cmd, confidence);
      },
      onError: (err) => {
        setErrorMessage(err.message);
        setTimeout(() => setErrorMessage(null), 6000);
      },
    });

    // Spacebar listener for Push-to-Talk
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        voiceService.togglePushToTalk();
      }
      if (e.code === 'Escape') {
        handleInterrupt();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      voiceService.destroy();
    };
  }, []);

  const handleToggleVoiceMode = () => {
    const nextMode = voiceMode === 'push-to-talk' ? 'wake-word' : 'push-to-talk';
    setVoiceMode(nextMode);
    voiceService.setMode(nextMode);
  };

  const handleChangeLanguage = (lang: string) => {
    setLanguage(lang);
    voiceService.setLanguage(lang);
  };

  const handleToggleMic = () => {
    if (isMuted) {
      setIsMuted(false);
    }
    voiceService.togglePushToTalk();
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (next) {
      voiceService.stopListening();
    }
  };

  const handleInterrupt = () => {
    voiceService.halt();
    setAssistantState('IDLE');
    setServerState('IDLE').catch(() => {});
  };

  const handlePlaySpeech = (text: string) => {
    voiceService.speak(text);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const handleSendCommand = async (queryText: string, confidence = 0.98) => {
    if (assistantState === 'THINKING') return;

    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence,
    };

    setMessages((prev) => [...prev, userMsg]);
    setAssistantState('THINKING');

    const result = await sendCommand(queryText, confidence);

    if (result.ok && result.data && result.data.response) {
      const data = result.data;
      const jarvisMsg: ChatMessage = {
        id: `resp-${Date.now()}`,
        sender: 'jarvis',
        text: data.response,
        speakText: data.speakText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningTrace: data.reasoningTrace,
        action: data.action,
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      setAssistantState('SPEAKING');

      // Speak aloud using browser TTS
      voiceService.speak(data.speakText || data.response, () => {
        setAssistantState('IDLE');
      });

      // If action includes launching an external URL, trigger browser
      if (data.action?.type === 'OPEN_URL' && data.action.url) {
        window.open(data.action.url, '_blank');
      }
    } else if (result.data && result.data.response) {
      // Backend returned structured JSON error response (e.g. HTTP 429 quota or HTTP 500 error)
      const data = result.data;
      const jarvisMsg: ChatMessage = {
        id: `resp-${Date.now()}`,
        sender: 'jarvis',
        text: data.response,
        speakText: data.speakText || data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningTrace: data.reasoningTrace || [result.error || 'Server reported issue'],
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      setAssistantState('SPEAKING');

      voiceService.speak(data.speakText || data.response, () => {
        setAssistantState('IDLE');
      });

      setErrorMessage(result.error || data.response);
      setTimeout(() => setErrorMessage(null), 6000);
    } else {
      // Non-JSON or connection error (e.g. HTML gateway page or network drop)
      const diagnosticText = result.isHtmlFallback
        ? `Gateway error (HTTP ${result.status}): Received an HTML page instead of JSON. Reverse proxy warmup or route mismatch.`
        : result.error || 'Unknown network or service failure.';

      console.error('[JARVIS ERROR] Directive dispatch failure:', result);
      setErrorMessage(diagnosticText);

      const errorReply = `Sir, directive processing error: ${diagnosticText}`;
      const errorMsg: ChatMessage = {
        id: `resp-${Date.now()}`,
        sender: 'jarvis',
        text: errorReply,
        speakText: errorReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningTrace: [
          `HTTP Status: ${result.status}`,
          result.isHtmlFallback ? 'Received HTML response instead of JSON' : 'Network/Service error',
          'Safely caught in apiClient without crashing application state',
        ],
      };

      setMessages((prev) => [...prev, errorMsg]);
      setAssistantState('SPEAKING');

      voiceService.speak(errorReply, () => {
        setAssistantState('IDLE');
      });
    }
  };

  // Modals Submit Handlers
  const handleCreateNote = async (title: string, content: string, tags: string[]) => {
    const res = await createNote(title, content, tags);
    if (res.ok) {
      handleSendCommand(`Take a note: ${title} - ${content}`);
    } else {
      setErrorMessage(res.error || 'Failed to save note');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleCreateReminder = async (title: string, time: string, priority: 'low' | 'medium' | 'high') => {
    const res = await createReminder(title, time, priority);
    if (res.ok) {
      handleSendCommand(`Set a reminder to ${title}`);
    } else {
      setErrorMessage(res.error || 'Failed to schedule reminder');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleLaunchApp = (appId: string) => {
    handleSendCommand(`Launch ${appId}`);
  };

  const handleSearchWeb = (query: string) => {
    handleSendCommand(`Search ${query}`);
  };

  return (
    <div className="min-h-screen bg-[#05080d] text-[#dee2ed] flex flex-col font-body selection:bg-[#00f0ff] selection:text-[#05080d] relative overflow-x-hidden">
      {/* Background Subtle HUD Grid Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="app-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#app-grid)" />
        </svg>
      </div>

      {/* Compact Tactical Header */}
      <Header
        assistantState={assistantState}
        voiceMode={voiceMode}
        onToggleVoiceMode={handleToggleVoiceMode}
        language={language}
        onChangeLanguage={handleChangeLanguage}
        onOpenNotes={() => setNoteModalOpen(true)}
        onOpenReminders={() => setReminderModalOpen(true)}
        onOpenApps={() => setAppModalOpen(true)}
      />

      {/* Main Cinematic Cockpit Viewport */}
      <main className="flex-1 w-full pt-16 z-10">
        <DesktopCockpitView
          assistantState={assistantState}
          onStateSelect={setAssistantState}
          messages={messages}
          interimTranscript={interimTranscript}
          onSendMessage={handleSendCommand}
          onVoiceTrigger={handleToggleMic}
          onInterrupt={handleInterrupt}
          onPlaySpeech={handlePlaySpeech}
          onClearHistory={handleClearHistory}
          errorMessage={errorMessage}
          onOpenNoteModal={() => setNoteModalOpen(true)}
          onOpenReminderModal={() => setReminderModalOpen(true)}
          onOpenAppModal={() => setAppModalOpen(true)}
          onOpenSearchModal={() => setSearchModalOpen(true)}
        />
      </main>

      {/* Bottom Command & Vocal Control Bar */}
      <BottomThumbBar
        assistantState={assistantState}
        isListening={assistantState === 'LISTENING'}
        isMuted={isMuted}
        onToggleMic={handleToggleMic}
        onToggleMute={handleToggleMute}
        onInterrupt={handleInterrupt}
        onSendCommand={handleSendCommand}
      />

      {/* Modals */}
      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSubmit={handleCreateNote}
      />

      <ReminderModal
        isOpen={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        onSubmit={handleCreateReminder}
      />

      <AppModal
        isOpen={appModalOpen}
        onClose={() => setAppModalOpen(false)}
        onLaunch={handleLaunchApp}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={handleSearchWeb}
      />
    </div>
  );
}
