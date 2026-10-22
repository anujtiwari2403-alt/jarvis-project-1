# JARVIS NEXUS — Windows Laptop & Android AI Voice Assistant

Namaste! Yeh **JARVIS NEXUS** ka local Python backend service aur architecture documentation hai.
Agar aap beginner hain, to tension mat lijiye — neeche step-by-step simple Hinglish aur English me complete setup samjhaya gaya hai.

---

## 1. Wake-Word Explanation: "Hey Jarvis"

### Kya "Hey Jarvis" out-of-the-box chalta hai ya custom model train karna padega?
* **Out of the box supported hai!**
* Hum **openWakeWord** engine use karte hain. Iske official pre-trained models me **`hey_jarvis_v0.1.onnx`** already baked-in hota hai.
* Aapko koi custom model train karne ki zaroorat nahi hai. Jab aap setup script run karenge (`openwakeword.utils.download_models()`), toh `hey_jarvis` model automatically download ho jata hai.
* **Push-to-Talk Fallback:** Agar laptop ka mic noisy environment me ho ya wake-word trigger na ho, toh UI me **Spacebar** ya **Mic button** press karke directly Push-to-Talk use kar sakte hain.

---

## 2. Windows Laptop Setup Steps (PowerShell)

Apne Windows laptop par **PowerShell** (Run as Administrator) open karein aur yeh commands run karein:

```powershell
# Step 1: JARVIS folder me jayein
cd backend

# Step 2: Automated setup script run karein (Yeh virtual environment banayega aur packages install karega)
.\setup.ps1
```

Agar manual step-by-step install karna chahte hain:

```powershell
# Virtual environment create karein
python -m venv venv

# Virtual environment activate karein
.\venv\Scripts\Activate.ps1

# Pip upgrade karein aur dependencies install karein
python -m pip install --upgrade pip
pip install -r requirements.txt

# OpenWakeWord model download karein
python -c "import openwakeword; openwakeword.utils.download_models()"

# Automated tests run karke verify karein
pytest test_backend.py -v
```

---

## 3. Server Start Kaise Karein?

Simply double-click karein:
```bat
.\run.bat
```
Ya command run karein:
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Service starts at `http://127.0.0.1:8000`.

---

## 4. Voice Engines used
1. **Wake-word**: openWakeWord (`hey_jarvis_v0.1.onnx`)
2. **Speech-to-Text (STT)**: `faster-whisper` (tiny model, CPU int8 for low latency on any laptop) + Web Speech API fallback
3. **Text-to-Speech (TTS)**: `pyttsx3` (Windows SAPI5 voice: David/Zira) + Browser Web Speech Synthesis
4. **Self-Hearing Prevention**: JARVIS sets `is_speaking = True` during audio playback so it never triggers itself.

---

## 5. Approved Voice Commands (Hindi, Hinglish & English)

| Query / Command | Kya Action Hoga |
| :--- | :--- |
| *"Hey Jarvis, what time is it?"* ya *"Jarvis kitne baje hain?"* | Current atomic time & date voice me batayega |
| *"Jarvis, open YouTube"* ya *"YouTube kholo"* | Browser me YouTube open karega |
| *"Jarvis, launch terminal"* ya *"code kholo"* | VS Code / Terminal open karega (safe allowlist) |
| *"Jarvis, note likho: meeting at 4 PM"* | Local encrypted notes me save karega |
| *"Jarvis, reminder set karo: call client"* | Chrono queue me reminder schedule karega |
| *"Jarvis, system status batao"* | Latency, CPU, RAM and paired nodes status report karega |

---

## 6. Android Phone Remote Pairing

1. Laptop screen par **Diagnostics > Pair New Compute Rig** click karein.
2. Screen par **Quantum QR Reticle** aur **6-digit PIN** (e.g. `749-204`) dikhayi dega.
3. Phone ke browser me applet URL kholein aur PIN enter karein.
4. Paired phone se aap voice aur text commands bhej sakte hain jo laptop par execute honge.
