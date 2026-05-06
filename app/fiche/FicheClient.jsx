"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import PagedMarkdownFiche from "../../components/PagedMarkdownFiche";
import { SHEET_MARKDOWN_VERSION, SHEET_STORAGE_KEY } from "../../lib/revisionSheet";

export default function FicheClient() {
  const [payload, setPayload] = useState(undefined);

  useEffect(() => {
    startTransition(() => {
      try {
        const raw = sessionStorage.getItem(SHEET_STORAGE_KEY);
        if (!raw) {
          setPayload(null);
          return;
        }
        const data = JSON.parse(raw);
        if (
          data?.version === SHEET_MARKDOWN_VERSION &&
          typeof data.markdown === "string" &&
          data.markdown.length > 0
        ) {
          setPayload(data);
          return;
        }
        setPayload(null);
      } catch {
        setPayload(null);
      }
    });
  }, []);

  if (payload === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 text-slate-500">
        Chargement…
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_200%_100%_at_50%_-18%,#e0e7ff_0%,#dbeafe_22%,#cffafe_40%,rgba(238,242,255,0.55)_56%,transparent_72%),linear-gradient(180deg,#eef2ff_0%,#f1f5f9_50%,#f1f5f9_100%)] px-4 py-16 text-center">
        <p className="max-w-md text-slate-700">
          Aucune fiche à afficher. Retourne à l’accueil, choisis une matière et un sujet, puis génère une
          fiche.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Retour à l’accueil
        </Link>
      </div>
    );
  }

  const { markdown, meta } = payload;

  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_200%_100%_at_50%_-18%,#e0e7ff_0%,#dbeafe_22%,#cffafe_40%,rgba(238,242,255,0.55)_56%,transparent_72%),linear-gradient(180deg,#eef2ff_0%,#f1f5f9_50%,#f1f5f9_100%)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/reviser"
            className="text-sm font-semibold text-indigo-700 hover:text-indigo-600"
          >
            ← Nouvelle fiche
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            Imprimer
          </button>
        </div>

        {meta ? (
          <p className="mb-4 text-center text-sm text-slate-600 print:text-slate-500">
            <span className="font-medium text-slate-800">{meta.topicLabel}</span>
            {" · "}
            {meta.subjectName} — {meta.classLabel}
          </p>
        ) : null}

        <PagedMarkdownFiche markdown={markdown} />

        <footer className="mt-8 text-center text-[11px] text-slate-500 print:mt-6 print:text-slate-400">
          Fiche générée avec FlashRévis — usage personnel pour réviser.
        </footer>
      </div>
    </div>
  );
}
