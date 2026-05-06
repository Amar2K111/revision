"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BTS_SPECIALIZATION_GROUPS,
  CLASSES,
  getSubjectsForClass,
  TERMINALE_SPECIALIZATION_GROUPS,
} from "../../data/curriculum";
import {
  SHEET_MARKDOWN_VERSION,
  SHEET_STORAGE_KEY,
} from "../../lib/revisionSheet";
import { SelectField } from "../../components/SelectField";

export default function ReviserPage() {
  const router = useRouter();
  const [classId, setClassId] = useState("3e");
  const [specializationId, setSpecializationId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicIndex, setTopicIndex] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classe = CLASSES.find((c) => c.id === classId);
  const subjects = useMemo(
    () => getSubjectsForClass(classId, specializationId),
    [classId, specializationId],
  );
  const subject = subjects.find((s) => s.id === subjectId);
  const topics = subject?.topics ?? [];

  const subjectFieldDisabled =
    !classe?.available ||
    ((classId === "term" || classId === "bts2") && !specializationId) ||
    ((classId === "term" || classId === "bts2") &&
      specializationId !== "" &&
      subjects.length === 0);

  const canGenerate =
    classe?.available &&
    subject &&
    topicIndex !== "" &&
    Number(topicIndex) >= 0;

  const subjectHintText = !classe?.available
    ? "Choisis d’abord un niveau disponible."
    : classId === "term"
      ? !specializationId
        ? "Choisis d’abord une spécialité."
        : subjects.length === 0
          ? "Programme à venir pour cette voie."
          : specializationId.startsWith("tech-")
            ? "Matières de ta série (terminale technologique)."
            : "Matières de ta spécialité (terminale générale)."
      : classId === "bts2"
        ? !specializationId
          ? "Choisis d’abord ton BTS."
          : subjects.length === 0
            ? "Programme à venir pour ce BTS."
            : "Matières de ton programme BTS."
        : "Toutes les matières du brevet pour la 3ème.";

  function handleClassChange(next) {
    setClassId(next);
    setSpecializationId("");
    setSubjectId("");
    setTopicIndex("");
    setError(null);
  }

  function handleSpecializationChange(next) {
    setSpecializationId(next);
    setSubjectId("");
    setTopicIndex("");
    setError(null);
  }

  function handleSubjectChange(next) {
    setSubjectId(next);
    setTopicIndex("");
    setError(null);
  }

  async function handleGenerate() {
    if (!canGenerate || !classe || !subject) {
      return;
    }
    setError(null);
    setLoading(true);
    const topicLabel = topics[Number(topicIndex)];
    try {
      const res = await fetch("/api/generate-fiche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          classLabel: classe.label,
          subjectId: subject.id,
          subjectName: subject.name,
          topicLabel,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Échec de la génération.",
        );
      }
      const payload = {
        version: SHEET_MARKDOWN_VERSION,
        markdown: data.markdown,
        meta: data.meta ?? {
          classLabel: classe.label,
          subjectName: subject.name,
          topicLabel,
        },
      };
      try {
        sessionStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        throw new Error("Impossible d’enregistrer la fiche (stockage navigateur).");
      }
      router.push("/fiche");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_200%_100%_at_50%_-18%,#e0e7ff_0%,#dbeafe_22%,#cffafe_40%,rgba(238,242,255,0.55)_56%,transparent_72%),linear-gradient(180deg,#eef2ff_0%,#f1f5f9_50%,#f1f5f9_100%)]">
      <div className="mx-auto flex w-full max-w-xl flex-col px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header>
          <div className="mb-6 print:hidden">
            <Link
              href="/"
              className="text-sm font-semibold text-indigo-700 hover:text-indigo-600"
            >
              ← Accueil
            </Link>
          </div>
          <div className="text-center">
            <h1 className="whitespace-nowrap font-[family-name:var(--font-geist-sans)] text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl lg:text-4xl">
              Fiche de révision complète
            </h1>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-indigo-600/90 sm:mt-3">
              Révision facile
            </p>
          </div>

          <div className="mt-8 space-y-5 rounded-2xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.35)] backdrop-blur-md">
            <SelectField
              id="class"
              label="Classe"
              hint={
                classe?.available
                  ? null
                  : "Ce niveau arrive bientôt."
              }
              value={classId}
              onChange={handleClassChange}
            >
              {CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                  {!c.available ? " (bientôt)" : ""}
                </option>
              ))}
            </SelectField>

            {classId === "term" ? (
              <SelectField
                id="specialization"
                label="Spécialisation"
                hint={
                  classe?.available
                    ? "Choix utilisé pour proposer les matières et sujets du bac."
                    : "Tu peux déjà indiquer ta voie ; ce niveau n’est pas encore disponible ici."
                }
                value={specializationId}
                onChange={handleSpecializationChange}
              >
                <option value="">— Choisir une spécialisation —</option>
                {TERMINALE_SPECIALIZATION_GROUPS.map((g) => (
                  <optgroup key={g.groupLabel} label={g.groupLabel}>
                    {g.options.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </SelectField>
            ) : classId === "bts2" ? (
              <SelectField
                id="bts-program"
                label="BTS"
                hint={
                  classe?.available
                    ? "Choix de ton BTS (2ᵉ année) pour afficher les matières."
                    : "Tu peux déjà indiquer ton BTS ; ce niveau n’est pas encore disponible ici."
                }
                value={specializationId}
                onChange={handleSpecializationChange}
              >
                <option value="">— Choisir un BTS —</option>
                {BTS_SPECIALIZATION_GROUPS.map((g) => (
                  <optgroup key={g.groupLabel} label={g.groupLabel}>
                    {g.options.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </SelectField>
            ) : null}

            <SelectField
              key={classId === "3e" ? classId : `${classId}-${specializationId}`}
              id="subject"
              label="Matière"
              hint={subjectHintText}
              value={subjectId}
              onChange={handleSubjectChange}
              disabled={subjectFieldDisabled}
            >
              <option value="">
                {classe?.available ? "— Choisir une matière —" : "— Indisponible —"}
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              key={subjectId || "__none__"}
              id="topic"
              label="Sujet / notion"
              menuPlacement="above"
              hint={
                subject
                  ? `${topics.length} notion(s) dans cette matière.`
                  : "Sélectionne une matière pour afficher les sujets."
              }
              value={topicIndex}
              onChange={(v) => {
                setTopicIndex(v);
                setError(null);
              }}
              disabled={!subject}
            >
              <option value="">
                {subject ? "— Choisir un sujet —" : "— Choisis d’abord une matière —"}
              </option>
              {topics.map((t, i) => (
                <option key={t} value={String(i)}>
                  {t}
                </option>
              ))}
            </SelectField>

            {classe?.available ? (
              <div className="space-y-2 pt-1">
                <p className="text-center text-xs text-slate-600">
                  Même cadre FlashRévis : essentiel → programme dense → astuces (sans quiz).
                  {classId === "3e" && subjectId === "math" ? (
                    <span className="block text-slate-500">
                      Maths 3ᵉ : enrichissement automatique quand la notion est en base experte.
                    </span>
                  ) : null}
                </p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canGenerate || loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {loading ? "Génération en cours…" : "Générer la fiche"}
                </button>
                {error ? (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-800">
                    {error}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </header>
      </div>
    </div>
  );
}
