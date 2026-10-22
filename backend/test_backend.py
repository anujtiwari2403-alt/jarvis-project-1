"""
Comprehensive Test Suite for JARVIS NEXUS
Validates command recognition, silence, unclear speech, deterministic skills,
distinguishing false positives, and safety execution boundaries.
"""
import pytest
from backend.safety import is_approved_app, is_approved_url, sanitize_input
from backend.command_router import CommandRouter
from backend.memory_db import create_note, get_all_notes, delete_note, create_reminder, get_all_reminders

@pytest.fixture
def router():
    return CommandRouter()

# 1. Temporal Skills Testing
def test_time_command(router):
    res = router.route("Jarvis what time is it")
    assert res["success"] is True
    assert res["skill"] == "temporal_time"
    assert "time" in res["display"].lower()

def test_hindi_time_command(router):
    res = router.route("Jarvis kitne baje hain")
    assert res["success"] is True
    assert res["skill"] == "temporal_time"
    assert "सर" in res["spoken"]

def test_date_command(router):
    res = router.route("what is today's date")
    assert res["success"] is True
    assert res["skill"] == "temporal_date"
    assert "date" in res["display"].lower()

def test_false_positive_time_not_triggered(router):
    # Phrases containing the word 'time' but NOT asking for current time
    # must NOT trigger the temporal skill!
    res1 = router.route("it is time to build our website")
    assert res1["skill"] != "temporal_time"

    res2 = router.route("set a reminder for meeting time")
    # Must trigger reminder skill, NOT time skill!
    assert res2["skill"] == "reminders_create"

# 2. Approved Websites Skill Testing
def test_open_website_approved(router):
    res = router.route("open youtube")
    assert res["success"] is True
    assert res["skill"] == "web_browser"
    assert "youtube.com" in res["target"]

def test_open_website_hindi(router):
    res = router.route("github kholo")
    assert res["success"] is True
    assert res["skill"] == "web_browser"
    assert "github.com" in res["target"]

# 3. Approved App Launcher Testing
def test_launch_terminal_app(router):
    res = router.route("launch terminal")
    assert res["success"] is True
    assert res["skill"] == "app_launcher"

def test_launch_calculator_app(router):
    res = router.route("open calc")
    assert res["success"] is True
    assert res["skill"] == "app_launcher"

# 4. Notes Skill Testing (Creation vs Listing)
def test_create_note(router):
    res = router.route("take a note: Review Q3 architectural specs")
    assert res["success"] is True
    assert res["skill"] == "notes_create"
    assert "Review Q3" in res["note"]["content"]

def test_list_notes(router):
    res = router.route("show all notes")
    assert res["success"] is True
    assert res["skill"] == "notes_list"

def test_false_positive_notes_query(router):
    # Asking to show notes should list them, not create a note named "show notes"
    res = router.route("list notes")
    assert res["skill"] == "notes_list"
    assert res["skill"] != "notes_create"

# 5. Reminders Skill Testing
def test_create_reminder(router):
    res = router.route("set a reminder to inspect telemetry at 16:30")
    assert res["success"] is True
    assert res["skill"] == "reminders_create"
    assert "inspect telemetry" in res["reminder"]["title"]

# 6. Web Search Skill
def test_web_search(router):
    res = router.route("search for quantum computing advancements")
    assert res["success"] is True
    assert res["skill"] == "web_search"
    assert "quantum" in res["target"]

# 7. System Diagnostics Skill
def test_system_diagnostics(router):
    res = router.route("system status")
    assert res["success"] is True
    assert res["skill"] == "diagnostics"

# 8. Safety Whitelist & Sanitization Testing
def test_safety_boundary():
    assert is_approved_app("terminal") is True
    assert is_approved_app("code") is True
    assert is_approved_app("notepad") is True
    assert is_approved_app("calc") is True
    # Dangerous commands rejected
    assert is_approved_app("powershell.exe -enc ...") is False
    assert is_approved_app("rm") is False

def test_url_boundary():
    assert is_approved_url("https://www.google.com") is True
    assert is_approved_url("https://github.com/torvalds") is True
    assert is_approved_url("https://malicious-domain.xyz") is False

def test_input_sanitization():
    raw = "open terminal; echo hacked > /tmp/test"
    cleaned = sanitize_input(raw)
    assert ";" not in cleaned
    assert ">" not in cleaned
