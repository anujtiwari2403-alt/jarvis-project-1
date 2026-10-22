"""
JARVIS NEXUS Wake-Word Detection Engine
Uses openWakeWord for offline, zero-latency detection of 'Hey Jarvis'.

TECHNICAL NOTE & DOCUMENTATION:
'Hey Jarvis' IS supported out of the box in openWakeWord via its official pre-trained
model: 'hey_jarvis_v0.1.onnx'. No custom training is required for basic usage.
If running in an environment without microphone access (or headless VM), this module
safely falls back to software Push-to-Talk and REST trigger modes.
"""
import logging
from typing import Callable, Optional

logger = logging.getLogger("JarvisWakeWord")

class WakeWordDetector:
    def __init__(self, model_name: str = "hey_jarvis", sensitivity: float = 0.5):
        self.model_name = model_name
        self.sensitivity = sensitivity
        self.is_running = False
        self._model = None
        self._initialize_model()

    def _initialize_model(self):
        try:
            import openwakeword
            from openwakeword.model import Model
            openwakeword.utils.download_models()
            self._model = Model(wakeword_models=[self.model_name], inference_framework="onnx")
            logger.info(f"[WAKE-WORD] Model '{self.model_name}' loaded successfully.")
        except Exception as e:
            logger.warning(
                f"[WAKE-WORD] Pre-trained openWakeWord not loaded ({e}). "
                f"Falling back to Push-to-Talk (PTT) and simulated trigger mode."
            )
            self._model = None

    def is_available(self) -> bool:
        return self._model is not None

    def process_audio_chunk(self, audio_chunk_16khz) -> bool:
        """
        Accepts a chunk of 16kHz 16-bit mono PCM audio numpy array.
        Returns True if 'Hey Jarvis' was detected with confidence >= sensitivity.
        """
        if not self._model:
            return False

        try:
            prediction = self._model.predict(audio_chunk_16khz)
            score = prediction.get(self.model_name, 0.0)
            if score >= self.sensitivity:
                logger.info(f"[WAKE-WORD DETECTED] Wake phrase triggered! Score: {score:.3f}")
                self._model.reset()
                return True
        except Exception as e:
            logger.error(f"[WAKE-WORD] Error during audio inference: {e}")
        return False
