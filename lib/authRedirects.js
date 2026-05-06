/** Cible après « connexion » (stub) : doit rester un chemin relatif du site. */
export function sanitizeNextPath(raw) {
  if (typeof raw !== "string" || raw.length === 0) {
    return "/reviser";
  }
  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return "/reviser";
  }
  return raw;
}
