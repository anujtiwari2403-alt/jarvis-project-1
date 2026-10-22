"""
JARVIS NEXUS Voice Engine
Handles Windows Text-To-Speech (pyttsx3 / SAPI5) and Speech-To-Text (faster-whisper).
Enforces self-hearing suppression (interruptible speech state).
"""
import logging
import threading
import time
from typing import Optional, Callable

logger = logging.getLogger("JarvisVoiceEngine")

class VoiceEngine:
    def __init__(self, tts_rate: int = 175, tts_volume: float = 0.95):
        self.is_speaking = False
        self.tts_rate = tts_rate
        self.tts_volume = tts_volume
        self._tts_engine = None
        self._stt_model = None
        self._init_tts()
        self._init_stt()

    def _init_tts(self):
        try:
            import pyttsx3
            self._tts_engine = pyttsx3.init()
            self._tts_engine.setProperty("rate", self.tts_rate)
            self._tts_engine.setProperty("volume", self.tts_volume)
            # Find natural voice
            voices = self._tts_engine.getProperty("voices")
            for v in voices:
                if "david" in v.name.lower() or "zira" in v.name.lower() or "george" in v.name.lower():
                    self._tts_engine.setProperty("voice", v.id)
                    break
            logger.info("[TTS] Windows pyttsx3 engine initialized.")
        except Exception as e:
            logger.warning(f"[TTS] pyttsx3 not initialized ({e}). Web Audio TTS fallback active.")
            self._tts_engine = None

    def _init_stt(self):
        try:
            from faster_whisper import WhisperModel
            # Load tiny or base model for low-latency CPU inference on Windows laptops
            self._stt_model = WhisperModel("tiny", device="cpu", compute_type="int8")
            logger.info("[STT] faster-whisper tiny model initialized.")
        except Exception as e:
            logger.warning(f"[STT] faster-whisper not loaded ({e}). Web Speech API fallback active.")
            self._stt_model = None

    def speak(self, text: str, on_done: Optional[Callable[[], None]] = None):
        """Speaks text asynchronously while marking is_speaking = True to prevent self-loop."""
        if not text:
            return

        def _worker():
            self.is_speaking = True
            logger.info(f"[SPEAKING] {text}")
            if self._tts_engine:
                try:
                    self._tts_engine.say(text)
                    self._tts_engine.runAndWait()
                except Exception as e:
                    logger.error(f"[TTS ERROR] {e}")
            else:
                # Fallback simulation timing
                time.sleep(max(1.0, len(text) * 0.05))

            self.is_speaking = False
            if on_done:
                on_done()

        t = threading.Thread(target=_worker, daemon=True)
        t.start()

    def stop_speaking(self):
        """Immediately halts any speech in progress."""
        if self._tts_engine and self.is_speaking:
            try:
                self._tts_engine.stop()
            except Exception:
                pass
        self.is_speaking = False
        logger.info("[TTS] Speech interrupted by operator HALT.")

    def transcribe_audio_file(self, audio_path: str, language: Optional[str] = None) -> str:
        """Transcribes audio file to text using faster-whisper."""
        if not self._stt_model:
            return ""

        try:
            # Language 'hi' for Hindi, 'en' for English, None for auto-detect (great for Hinglish)
            segments, info = self._stt_model.transcribe(audio_path, language=language, beam_size=3)
            transcribed_text = " ".join([seg.text for seg in segments]).strip()
            logger.info(f"[TRANSCRIBE] Detected {info.language} ({info.language_probability:.2f}): {transcribed_text}")
            return transcribed_text
        except Exception as e:
            logger.error(f"[STT ERROR] {e}")
            return ""
