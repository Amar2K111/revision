/** Cookie de secours si OAuth ne renvoie pas ?next= sur /auth/callback (court, même site). */
export const OAUTH_RETURN_PATH_COOKIE = "revision_oauth_next";

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
