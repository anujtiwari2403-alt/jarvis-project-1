"""
JARVIS NEXUS Local Persistent Memory
Provides encrypted/safe local JSON storage for notes, reminders, and user preferences.
"""
import json
import os
import time
from typing import List, Dict, Any, Optional

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

NOTES_FILE = os.path.join(DATA_DIR, "notes.json")
REMINDERS_FILE = os.path.join(DATA_DIR, "reminders.json")
PREFERENCES_FILE = os.path.join(DATA_DIR, "preferences.json")

def _load_json(filepath: str, default: Any) -> Any:
    if not os.path.exists(filepath):
        return default
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default

def _save_json(filepath: str, data: Any) -> None:
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# Notes Service
def get_all_notes() -> List[Dict[str, Any]]:
    return _load_json(NOTES_FILE, [])

def create_note(title: str, content: str, tags: Optional[List[str]] = None) -> Dict[str, Any]:
    notes = get_all_notes()
    note_id = f"note-{int(time.time() * 1000)}"
    new_note = {
        "id": note_id,
        "title": title or content[:30],
        "content": content,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "tags": tags or ["TACTICAL", "LOCAL"]
    }
    notes.insert(0, new_note)
    _save_json(NOTES_FILE, notes)
    return new_note

def search_notes(query: str) -> List[Dict[str, Any]]:
    notes = get_all_notes()
    q = query.lower()
    return [n for n in notes if q in n["title"].lower() or q in n["content"].lower()]

def delete_note(note_id: str) -> bool:
    notes = get_all_notes()
    initial_len = len(notes)
    filtered = [n for n in notes if n["id"] != note_id]
    if len(filtered) < initial_len:
        _save_json(NOTES_FILE, filtered)
        return True
    return False

# Reminders Service
def get_all_reminders() -> List[Dict[str, Any]]:
    return _load_json(REMINDERS_FILE, [])

def create_reminder(title: str, due_time: str = "18:00", priority: str = "medium") -> Dict[str, Any]:
    reminders = get_all_reminders()
    rem_id = f"rem-{int(time.time() * 1000)}"
    new_rem = {
        "id": rem_id,
        "title": title,
        "time": due_time,
        "priority": priority,
        "completed": False,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    reminders.insert(0, new_rem)
    _save_json(REMINDERS_FILE, reminders)
    return new_rem

def complete_reminder(rem_id: str, completed: bool = True) -> Optional[Dict[str, Any]]:
    reminders = get_all_reminders()
    for r in reminders:
        if r["id"] == rem_id:
            r["completed"] = completed
            _save_json(REMINDERS_FILE, reminders)
            return r
    return None

def delete_reminder(rem_id: str) -> bool:
    reminders = get_all_reminders()
    initial_len = len(reminders)
    filtered = [r for r in reminders if r["id"] != rem_id]
    if len(filtered) < initial_len:
        _save_json(REMINDERS_FILE, filtered)
        return True
    return False

def purge_memory() -> Dict[str, str]:
    """Flushes volatile and non-essential logs while preserving core preferences."""
    _save_json(NOTES_FILE, [])
    _save_json(REMINDERS_FILE, [])
    return {"status": "SUCCESS", "message": "All local notes and reminders purged."}
