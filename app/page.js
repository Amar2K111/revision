import Link from "next/link";

const pageBg =
  "min-h-dvh bg-[radial-gradient(ellipse_200%_100%_at_50%_-18%,#e0e7ff_0%,#dbeafe_22%,#cffafe_40%,rgba(238,242,255,0.55)_56%,transparent_72%),linear-gradient(180deg,#eef2ff_0%,#f1f5f9_50%,#f1f5f9_100%)]";

export const metadata = {
  title: "Révision facile — Accueil",
  description:
    "Fiches de révision claires pour le Brevet, le Bac et le BTS. Essentiel, programme dense et astuces.",
};

export default function HomePage() {
  return (
    <div className={pageBg}>
      {/* Halos discrets, même famille de bleus que le reste du site */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[44rem] -translate-x-1/2 rounded-[50%] bg-indigo-400/25 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-4 py-12 sm:max-w-xl sm:px-6 sm:py-16 lg:max-w-2xl lg:px-8 lg:py-20">
        <div className="rounded-2xl border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.35)] backdrop-blur-md sm:rounded-3xl sm:p-10 md:p-12">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600/90">
              Révision facile
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-[2.5rem] md:leading-tight">
              Fiches de révision
              <span className="mt-1 block bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600 bg-clip-text text-transparent">
                claires et structurées
              </span>
            </h1>
            <p className="mt-5 text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
              Brevet, Bac ou BTS : trois parties par fiche — l’essentiel, le programme dense,
              les astuces. FlashRévis s’occupe du cadre, toi du sujet.
            </p>

            <Link
              href="/reviser"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 sm:w-auto sm:min-w-[200px]"
            >
              Commencer
            </Link>
          </div>

          <ul className="mt-10 grid gap-3 text-left sm:grid-cols-3 sm:gap-4">
            <li className="rounded-xl border border-indigo-100/80 bg-white/80 px-4 py-3 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                01
              </span>
              <p className="mt-1 text-sm font-medium text-slate-800">Essentiel</p>
              <p className="mt-0.5 text-xs leading-snug text-slate-500">
                Repères et techniques utiles tout de suite.
              </p>
            </li>
            <li className="rounded-xl border border-indigo-100/80 bg-white/80 px-4 py-3 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                02
              </span>
              <p className="mt-1 text-sm font-medium text-slate-800">Programme dense</p>
              <p className="mt-0.5 text-xs leading-snug text-slate-500">
                Le cœur du cours, sans blabla inutile.
              </p>
            </li>
            <li className="rounded-xl border border-indigo-100/80 bg-white/80 px-4 py-3 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                03
              </span>
              <p className="mt-1 text-sm font-medium text-slate-800">Astuces & pièges</p>
              <p className="mt-0.5 text-xs leading-snug text-slate-500">
                Réflexes examen, erreurs à éviter.
              </p>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-center text-[11px] text-slate-500">
          FlashRévis · usage personnel pour réviser
        </p>
      </div>
    </div>
  );
}
