"""
JARVIS NEXUS — Python FastAPI Windows Service Entry Point
Runs local REST endpoints & WebSockets on the laptop.
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import logging

from backend.command_router import CommandRouter
from backend.voice_engine import VoiceEngine
from backend.wake_word import WakeWordDetector
from backend.memory_db import (
    get_all_notes, create_note, delete_note,
    get_all_reminders, create_reminder, complete_reminder, delete_reminder,
    purge_memory
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("JarvisNexusMain")

app = FastAPI(title="JARVIS NEXUS Laptop Voice Engine", version="4.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = CommandRouter()
voice = VoiceEngine()
wake_detector = WakeWordDetector()

class CommandRequest(BaseModel):
    query: str
    source: Optional[str] = "local"
    language: Optional[str] = "en"

class NoteRequest(BaseModel):
    title: Optional[str] = None
    content: str
    tags: Optional[List[str]] = None

class ReminderRequest(BaseModel):
    title: str
    time: Optional[str] = "18:00"
    priority: Optional[str] = "medium"

class PurgeRequest(BaseModel):
    confirm: bool

# Connected WebSocket clients list
active_connections: List[WebSocket] = []

async def broadcast_ws(message: Dict[str, Any]):
    for connection in active_connections:
        try:
            await connection.send_json(message)
        except Exception:
            pass

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    logger.info(f"[WS] Client connected. Active: {len(active_connections)}")
    try:
        while True:
            data = await websocket.receive_text()
            # Handle client telemetry or commands
            await websocket.send_json({"type": "PONG", "received": data})
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        logger.info(f"[WS] Client disconnected. Active: {len(active_connections)}")

@app.get("/")
def read_root():
    return {
        "name": "JARVIS NEXUS Laptop Core",
        "version": "4.2",
        "wake_word_available": wake_detector.is_available(),
        "tts_available": voice._tts_engine is not None,
        "stt_available": voice._stt_model is not None,
    }

@app.post("/api/command")
async def execute_command(req: CommandRequest):
    logger.info(f"[COMMAND RECEIVED] {req.query}")
    await broadcast_ws({"type": "STATE_CHANGED", "state": "THINKING"})
    
    result = router.route(req.query)
    
    if result.get("spoken"):
        voice.speak(result["spoken"])
        await broadcast_ws({"type": "STATE_CHANGED", "state": "SPEAKING"})

    await broadcast_ws({
        "type": "TRANSCRIPT_UPDATE",
        "query": req.query,
        "result": result
    })
    
    return result

@app.post("/api/interrupt")
async def interrupt_speech():
    voice.stop_speaking()
    await broadcast_ws({"type": "STATE_CHANGED", "state": "IDLE"})
    return {"status": "HALTED"}

# Notes endpoints
@app.get("/api/notes")
def list_notes():
    return {"notes": get_all_notes()}

@app.post("/api/notes")
def add_note(req: NoteRequest):
    note = create_note(req.title or "", req.content, req.tags)
    return {"success": True, "note": note}

@app.delete("/api/notes/{note_id}")
def remove_note(note_id: str):
    success = delete_note(note_id)
    return {"success": success}

# Reminders endpoints
@app.get("/api/reminders")
def list_reminders():
    return {"reminders": get_all_reminders()}

@app.post("/api/reminders")
def add_reminder(req: ReminderRequest):
    rem = create_reminder(req.title, req.time or "18:00", req.priority or "medium")
    return {"success": True, "reminder": rem}

@app.delete("/api/reminders/{rem_id}")
def remove_reminder(rem_id: str):
    success = delete_reminder(rem_id)
    return {"success": success}

@app.post("/api/memory/purge")
def emergency_purge(req: PurgeRequest):
    if not req.confirm:
        raise HTTPException(status_code=400, detail="Explicit confirmation required.")
    res = purge_memory()
    return res

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
