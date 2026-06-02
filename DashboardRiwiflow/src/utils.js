// --- UTILITY FUNCTIONS ---

/** Sanitizes strings to prevent XSS when injecting into innerHTML */
export const escHtml = (s = "") => {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

/** Extracts initials from a name (maximum 2 characters) */
export const initials = (name = "") => {
  if (!name || typeof name !== "string") return "";
  return name.split(" ").map(w => w[0] || "").join("").slice(0, 2).toUpperCase();
};