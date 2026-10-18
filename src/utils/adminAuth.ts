// Anmeldung für Admin-Bereich und Dozierenden-Funktionen.
// Das Kennwort wird ausschließlich auf dem Server geprüft (Secret ADMIN_PASSWORD in AI Studio).
// Im Browser wird nur ein zeitlich begrenztes, signiertes Token gespeichert.

const TOKEN_KEY = 'bb_admin_token';

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setAdminToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
    // Altlast der früheren, rein clientseitigen Freischaltung entfernen
    sessionStorage.removeItem('tha_admin_authenticated');
  } catch {
    /* Speicher nicht verfügbar */
  }
}

export type LoginResult = { ok: boolean; message?: string };

export async function adminLogin(password: string): Promise<LoginResult> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && typeof data.token === 'string') {
      setAdminToken(data.token);
      return { ok: true };
    }
    return { ok: false, message: data.error || 'Anmeldung fehlgeschlagen.' };
  } catch {
    return { ok: false, message: 'Server nicht erreichbar.' };
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/session', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!data.valid) setAdminToken(null);
    return Boolean(data.valid);
  } catch {
    return false;
  }
}

export function adminLogout() {
  setAdminToken(null);
}

export function adminAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
