/**
 * JARVIS NEXUS Advanced Voice Engine
 * Handles real-time Web Speech recognition (English, Hindi, Hinglish),
 * dedicated Wake-Word detection vs Push-to-Talk (PTT),
 * silence detection / debouncing to capture complete sentences,
 * confidence thresholding for unclear speech,
 * self-hearing suppression during TTS output,
 * audio volume / spectrum analysis, and clear error telemetry.
 */

export type VoiceState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR';

export interface VoiceError {
  code: 'not-allowed' | 'audio-capture' | 'no-speech' | 'network' | 'not-supported' | 'unclear';
  message: string;
}

export type VoiceStateCallback = (state: VoiceState) => void;
export type InterimTranscriptCallback = (text: string) => void;
export type FinalCommandCallback = (command: string, confidence: number, language: string) => void;
export type VoiceErrorCallback = (error: VoiceError) => void;
export type VolumeCallback = (level: number, frequencyData: Uint8Array) => void;

class VoiceService {
  private recognition: any = null;
  private isListening = false;
  private isSpeaking = false;
  private mode: 'wake-word' | 'push-to-talk' = 'push-to-talk';
  private currentLanguage = 'en-US'; // 'en-US', 'hi-IN', 'en-IN'

  // Debouncing / silence detection to prevent premature sentence cutting
  private silenceTimer: any = null;
  private accumulatedTranscript = '';
  private lastConfidence = 0.95;
  private isWakeWordActive = false; // Set to true after "Hey Jarvis" is triggered

  // Audio Context & Analyser for real-time waveform
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;

  // Registered Callbacks
  private onStateChange: VoiceStateCallback | null = null;
  private onInterim: InterimTranscriptCallback | null = null;
  private onFinalCommand: FinalCommandCallback | null = null;
  private onError: VoiceErrorCallback | null = null;
  private onVolume: VolumeCallback | null = null;

  constructor() {
    this.initRecognition();
  }

  public isSupported(): boolean {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  private initRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[VOX] Web Speech API not supported in this browser.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = this.currentLanguage;

      this.recognition.onstart = () => {
        this.isListening = true;
        if (!this.isSpeaking) {
          this.onStateChange?.('LISTENING');
        }
      };

      this.recognition.onresult = (event: any) => {
        // Strict self-hearing protection: If JARVIS or the browser is speaking, discard audio
        if (this.isSpeaking || ('speechSynthesis' in window && window.speechSynthesis.speaking)) {
          return;
        }

        let interimText = '';
        let latestFinalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const transcript = res[0].transcript;
          if (res.isFinal) {
            latestFinalChunk += ' ' + transcript;
            if (res[0].confidence !== undefined && res[0].confidence > 0) {
              this.lastConfidence = res[0].confidence;
            }
          } else {
            interimText += ' ' + transcript;
          }
        }

        interimText = interimText.trim();
        latestFinalChunk = latestFinalChunk.trim();

        if (latestFinalChunk) {
          this.accumulatedTranscript = (this.accumulatedTranscript + ' ' + latestFinalChunk).trim();
        }

        const displayText = (this.accumulatedTranscript + ' ' + interimText).trim();
        if (displayText) {
          this.onInterim?.(displayText);
        }

        // ==========================================
        // Mode 1: Wake-Word Mode Handling
        // ==========================================
        if (this.mode === 'wake-word') {
          const lower = displayText.toLowerCase();
          const wakePhrases = ['hey jarvis', 'jarvis', 'ok jarvis', 'हे जार्विस', 'सुनो जार्विस'];
          const detectedWake = wakePhrases.some((phrase) => lower.includes(phrase));

          if (detectedWake && !this.isWakeWordActive) {
            this.isWakeWordActive = true;
            this.playWakeChime();
            this.onStateChange?.('LISTENING');
            // Reset accumulated text starting from after the wake word
            for (const phrase of wakePhrases) {
              const idx = lower.indexOf(phrase);
              if (idx !== -1) {
                this.accumulatedTranscript = displayText.slice(idx + phrase.length).replace(/^[,.\s]+/, '');
                break;
              }
            }
          }

          if (this.isWakeWordActive && (latestFinalChunk || interimText)) {
            // Debounce silence detection (1.4 seconds of silence means user finished their directive)
            this.resetSilenceTimer(1400);
          }
        }

        // ==========================================
        // Mode 2: Push-to-Talk (PTT) Mode Handling
        // ==========================================
        if (this.mode === 'push-to-talk') {
          if (latestFinalChunk || interimText) {
            // In PTT mode, auto-finalize on 1.2s silence pause
            this.resetSilenceTimer(1200);
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        // Normal silence timeout in continuous mode; do not surface as fatal error
        if (event.error === 'no-speech') {
          return;
        }

        console.warn('[VOX] Recognition event error:', event.error);
        let userMessage = 'Speech recognition error occurred.';
        let code: VoiceError['code'] = 'network';

        if (event.error === 'not-allowed') {
          userMessage = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
          code = 'not-allowed';
          this.onStateChange?.('ERROR');
        } else if (event.error === 'audio-capture') {
          userMessage = 'No microphone device was detected. Please verify your hardware connection.';
          code = 'audio-capture';
          this.onStateChange?.('ERROR');
        } else if (event.error === 'network') {
          userMessage = 'Network connection issue for speech transcription.';
          code = 'network';
        }

        this.onError?.({ code, message: userMessage });
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // If continuous listening is desired and not speaking, auto-restart
        if (this.mode === 'wake-word' && !this.isSpeaking) {
          try {
            this.recognition.start();
          } catch (e) {
            // Already started or busy
          }
        } else if (!this.isSpeaking) {
          this.onStateChange?.('IDLE');
        }
      };
    } catch (err: any) {
      console.error('[VOX ERROR] Failed to initialize SpeechRecognition:', err);
      this.onError?.({ code: 'not-supported', message: 'SpeechRecognition API failed to initialize.' });
    }
  }

  private resetSilenceTimer(delayMs: number) {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    this.silenceTimer = setTimeout(() => {
      this.finalizeSentence();
    }, delayMs);
  }

  private finalizeSentence() {
    const rawCommand = this.accumulatedTranscript.trim();
    this.accumulatedTranscript = '';
    this.isWakeWordActive = false;

    if (!rawCommand) {
      return;
    }

    // Clean leading punctuation and wake phrases if leftover
    const cleanCommand = rawCommand
      .replace(/^(hey\s+jarvis|jarvis|ok\s+jarvis|हे\s+जार्विस|सुनो\s+जार्विस)[,\s]*/i, '')
      .replace(/^[,\.\?\!\s]+/, '')
      .trim();

    if (!cleanCommand || cleanCommand.length < 2) {
      // Meaningless noise or accidental click
      return;
    }

    // Unclear speech verification (Priority 1 requirement):
    // If confidence is low (< 0.45) or utterance is ambiguous noise, flag it
    if (this.lastConfidence > 0 && this.lastConfidence < 0.45) {
      this.onError?.({
        code: 'unclear',
        message: 'Speech confidence was low or unclear. Please repeat your directive.',
      });
      this.speak("Sir, I didn't clearly understand that. Could you please repeat?");
      return;
    }

    // Dispatch verified full sentence
    this.onFinalCommand?.(cleanCommand, this.lastConfidence, this.currentLanguage);
  }

  private playWakeChime() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // AudioContext audio chimes are optional
    }
  }

  // ==========================================
  // Public Controls
  // ==========================================
  public setMode(mode: 'wake-word' | 'push-to-talk') {
    this.mode = mode;
    this.accumulatedTranscript = '';
    this.isWakeWordActive = false;
    if (mode === 'wake-word') {
      this.startListening();
    } else {
      this.stopListening();
    }
  }

  public getMode(): 'wake-word' | 'push-to-talk' {
    return this.mode;
  }

  public setLanguage(lang: string) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
      if (this.isListening) {
        this.stopListening();
        setTimeout(() => this.startListening(), 200);
      }
    }
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public startListening() {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.isSupported()) {
      this.onError?.({ code: 'not-supported', message: 'Speech Recognition is not supported in this browser.' });
      return;
    }

    if (this.recognition && !this.isListening) {
      try {
        this.accumulatedTranscript = '';
        this.recognition.start();
        this.startMicrophoneAnalyser();
      } catch (e) {
        // Recognition already running or starting
      }
    }
    this.onStateChange?.('LISTENING');
  }

  public stopListening() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    this.onStateChange?.('IDLE');
  }

  // Push-to-Talk Toggle
  public startPushToTalk() {
    this.mode = 'push-to-talk';
    this.accumulatedTranscript = '';
    this.startListening();
  }

  public stopPushToTalk() {
    if (this.isListening) {
      // Finalize immediately on PTT release
      if (this.accumulatedTranscript.trim()) {
        this.finalizeSentence();
      }
      this.stopListening();
    }
  }

  public togglePushToTalk() {
    if (this.isListening) {
      this.stopPushToTalk();
    } else {
      this.startPushToTalk();
    }
  }

  public async startMicrophoneAnalyser() {
    if (this.audioContext) return;
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (this.analyser && this.onVolume) {
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          this.onVolume(average, dataArray);
        }
        this.animFrameId = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (err: any) {
      console.warn('[AUDIO MIC] Mic stream permission error:', err);
      if (err.name === 'NotAllowedError') {
        this.onError?.({
          code: 'not-allowed',
          message: 'Microphone permission denied by user. Click to grant microphone access.',
        });
      }
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('[VOX] Speech synthesis not supported in this browser.');
      onEnd?.();
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // Mark speaking to prevent self-hearing
    this.isSpeaking = true;
    this.onStateChange?.('SPEAKING');

    const cleanText = text.replace(/[*#`_\[\]]/g, '').trim();
    if (!cleanText) {
      this.isSpeaking = false;
      this.onStateChange?.('IDLE');
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('George') ||
            v.name.includes('David') ||
            v.name.includes('India'))
      ) ||
      voices.find((v) => v.lang.startsWith('hi')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 1.05;
    utterance.pitch = 0.98;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.onStateChange?.('IDLE');
      onEnd?.();
      // If wake-word continuous mode was active, resume
      if (this.mode === 'wake-word' && this.recognition) {
        try {
          this.recognition.start();
        } catch (e) {}
      }
    };

    utterance.onerror = (e) => {
      console.warn('[VOX] Speech synthesis error:', e);
      this.isSpeaking = false;
      this.onStateChange?.('IDLE');
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public halt() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    this.accumulatedTranscript = '';
    this.isWakeWordActive = false;
    this.isSpeaking = false;
    this.stopListening();
    this.onStateChange?.('IDLE');
  }

  public registerCallbacks(options: {
    onStateChange: VoiceStateCallback;
    onInterim?: InterimTranscriptCallback;
    onFinalCommand: FinalCommandCallback;
    onError?: VoiceErrorCallback;
    onVolume?: VolumeCallback;
  }) {
    this.onStateChange = options.onStateChange;
    this.onInterim = options.onInterim || null;
    this.onFinalCommand = options.onFinalCommand;
    this.onError = options.onError || null;
    this.onVolume = options.onVolume || null;
  }

  public destroy() {
    this.halt();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {}
    }
  }
}

export const voiceService = new VoiceService();
