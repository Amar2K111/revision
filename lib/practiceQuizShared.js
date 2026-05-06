/** Cible commune : nombre de questions posées dans une série quiz (prompt + tirage UI). */
export const PRACTICE_QUIZ_QUESTION_TARGET = 15;

/** Fisher–Yates, copie puis mélange. */
export function shuffleCopy(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Réordonne les choix au hasard tout en corrigeant `correctIndex`.
 * @param {{ id: string, q: string, choices: string[], correctIndex: number, explain: string }} q
 */
export function shuffleChoicesForQuestion(q) {
  const pairs = q.choices.map((label, i) => ({ label, isCorrect: i === q.correctIndex }));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return {
    ...q,
    choices: pairs.map((p) => p.label),
    correctIndex: pairs.findIndex((p) => p.isCorrect),
  };
}
