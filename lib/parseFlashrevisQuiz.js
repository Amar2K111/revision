/**
 * Extrait et retire le bloc fenced JSON en fin de fiche Markdown.
 * Accepte `revision-facile-quiz` (actuel) ou l’ancien `flashrevis-quiz` (rétrocompat).
 * @returns {{ markdown: string, practiceQuiz: PracticeQuizQuestion[] }}
 */

/** @typedef {{ id: string, q: string, choices: string[], correctIndex: number, explain: string }} PracticeQuizQuestion */
export function extractPracticeQuizFence(markdown) {
  const trimmed = typeof markdown === "string" ? markdown.trim() : "";
  if (!trimmed) {
    return { markdown: "", practiceQuiz: [] };
  }

  const re =
    /```\s*(?:revision-facile-quiz|flashrevis-quiz)\s*\r?\n([\s\S]*?)\r?\n```\s*$/im;
  const m = trimmed.match(re);
  if (!m || m.index == null) {
    return { markdown: trimmed, practiceQuiz: [] };
  }

  const jsonRaw = m[1]?.trim() ?? "";
  const markdownBody = trimmed.slice(0, m.index).trim();

  /** @type {PracticeQuizQuestion[]} */
  let practiceQuiz = [];
  try {
    const parsed = JSON.parse(jsonRaw);
    const arr = Array.isArray(parsed) ? parsed : [];
    practiceQuiz = arr.map(normalizeQuestion).filter(Boolean);
  } catch {
    practiceQuiz = [];
  }

  return { markdown: markdownBody, practiceQuiz };
}

/** @deprecated Utiliser extractPracticeQuizFence */
export function extractFlashrevisQuiz(markdown) {
  return extractPracticeQuizFence(markdown);
}

/** @returns {PracticeQuizQuestion | null} */
function normalizeQuestion(raw, index) {
  if (!raw || typeof raw !== "object") return null;
  const q = pickString(raw.q ?? raw.question);
  const choicesRaw = raw.choices ?? raw.options;
  const choices = Array.isArray(choicesRaw)
    ? choicesRaw.map((c) => String(c).trim()).filter((c) => c.length > 0)
    : [];
  const correctIndex = Number(raw.correctIndex ?? raw.answer ?? raw.c);
  const explain = pickString(raw.explain ?? raw.explanation);

  if (!q || choices.length < 2 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= choices.length) {
    return null;
  }

  return {
    id: String(raw.id ?? index),
    q,
    choices,
    correctIndex,
    explain,
  };
}

function pickString(v) {
  if (typeof v !== "string") return "";
  const s = v.trim();
  return s.length ? s : "";
}
