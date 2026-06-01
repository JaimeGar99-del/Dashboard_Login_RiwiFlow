// --- FUNCIONES UTILITARIAS ---

/** Sanitiza strings para prevenir XSS al inyectar en innerHTML */
export const escHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Extrae las iniciales de un nombre (máximo 2 caracteres) */
export const initials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
