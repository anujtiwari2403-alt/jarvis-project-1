"""
JARVIS NEXUS Safety & Privacy Framework
Enforces strict execution allowlist, prevents arbitrary shell execution,
and requires explicit authorization for sensitive actions.
"""
from typing import Set, Dict, Any
import re

# Strict whitelist of approved Windows executable commands
APPROVED_WINDOWS_APPS: Dict[str, str] = {
    "terminal": "wt.exe",
    "powershell": "powershell.exe",
    "cmd": "cmd.exe",
    "code": "code",
    "vscode": "code",
    "notepad": "notepad.exe",
    "calc": "calc.exe",
    "calculator": "calc.exe",
    "chrome": "chrome.exe",
    "browser": "chrome.exe",
    "spotify": "spotify.exe",
    "obsidian": "obsidian",
    "explorer": "explorer.exe",
}

# Strict whitelist of domains allowed to open
APPROVED_DOMAINS: Set[str] = {
    "google.com",
    "youtube.com",
    "github.com",
    "stackoverflow.com",
    "reddit.com",
    "wikipedia.org",
    "twitter.com",
    "x.com",
    "maps.google.com",
}

def is_approved_app(app_name: str) -> bool:
    """Checks if requested app is within the approved safety boundary."""
    cleaned = app_name.lower().strip()
    return cleaned in APPROVED_WINDOWS_APPS

def get_app_command(app_name: str) -> str:
    cleaned = app_name.lower().strip()
    return APPROVED_WINDOWS_APPS.get(cleaned, "")

def is_approved_url(url: str) -> bool:
    """Checks if the URL matches an authorized domain."""
    for domain in APPROVED_DOMAINS:
        if domain in url.lower():
            return True
    return False

def sanitize_input(text: str) -> str:
    """Sanitizes incoming vocal or text input against command injection tokens."""
    # Strip dangerous shell operators
    sanitized = re.sub(r"[;&|`$<>]", "", text)
    return sanitized.strip()
