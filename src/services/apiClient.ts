/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  isHtmlFallback?: boolean;
}

export interface CommandResponsePayload {
  success: boolean;
  response: string;
  speakText?: string;
  reasoningTrace?: string[];
  action?: {
    type: string;
    url?: string;
    targetName?: string;
    app?: any;
    note?: any;
    reminder?: any;
  };
  error?: string;
}

/**
 * Robust fetch wrapper that guarantees structured error reporting
 * and prevents JSON parsing crashes on HTML documents (e.g., <!doctype ...).
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, options);
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    const status = res.status;

    // Check if the response is HTML or plain text (e.g. reverse proxy warmup or 404 fallback)
    if (contentType.includes('text/html') || contentType.includes('text/plain')) {
      const text = await res.text();
      const isHtml = text.trim().startsWith('<') || text.includes('<!doctype') || contentType.includes('text/html');

      if (isHtml) {
        // Extract <title> or <h1> if present for helpful diagnostics
        const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
        const headingMatch = text.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        const pageTitle = titleMatch ? titleMatch[1].trim() : headingMatch ? headingMatch[1].trim() : 'HTML Document';

        return {
          ok: false,
          status,
          error: `Server or gateway returned an HTML document ("${pageTitle}", HTTP ${status}) instead of JSON. The service may be warming up or an incorrect route was requested.`,
          isHtmlFallback: true,
        };
      }

      // Plain text response that is not HTML
      return {
        ok: res.ok,
        status,
        error: res.ok ? undefined : text.slice(0, 300),
        data: (text as unknown) as T,
      };
    }

    // Parse JSON safely
    let parsed: any;
    try {
      parsed = await res.json();
    } catch (parseErr: any) {
      return {
        ok: false,
        status,
        error: `Failed to parse response as JSON: ${parseErr.message}`,
      };
    }

    if (!res.ok) {
      const errorMsg =
        parsed?.error ||
        parsed?.message ||
        (typeof parsed === 'string' ? parsed : `Request failed with HTTP status ${status}`);
      return {
        ok: false,
        status,
        data: parsed,
        error: typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : String(errorMsg),
      };
    }

    return {
      ok: true,
      status,
      data: parsed,
    };
  } catch (netErr: any) {
    return {
      ok: false,
      status: 0,
      error: `Network error: ${netErr.message || 'Unable to establish connection to backend service'}`,
    };
  }
}

/**
 * Dispatches a vocal or text command to the backend
 */
export async function sendCommand(query: string, confidence = 0.98) {
  return safeFetchJson<CommandResponsePayload>('/api/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, confidence }),
  });
}

/**
 * Creates a tactical note
 */
export async function createNote(title: string, content: string, tags: string[]) {
  return safeFetchJson<{ success: boolean; note: any }>('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, tags }),
  });
}

/**
 * Creates a chronological reminder
 */
export async function createReminder(title: string, time: string, priority: 'low' | 'medium' | 'high') {
  return safeFetchJson<{ success: boolean; reminder: any }>('/api/reminders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, time, priority }),
  });
}

/**
 * Updates assistant state on server
 */
export async function setServerState(state: string) {
  return safeFetchJson<{ success: boolean; state: string }>('/api/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });
}

/**
 * Purges volatile conversational cache
 */
export async function purgeVolatileMemory() {
  return safeFetchJson<{ success: boolean; message: string }>('/api/memory/purge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ confirm: true }),
  });
}
