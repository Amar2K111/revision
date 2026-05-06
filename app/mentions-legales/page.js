import Link from "next/link";

export const metadata = {
  title: "Mentions légales — Révision facile",
  description: "Mentions légales du service Révision facile.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-indigo-50/80 via-slate-50 to-slate-50">
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm">
          <Link href="/" className="font-semibold text-indigo-700 hover:text-indigo-600">
            ← Accueil
          </Link>
        </p>
        <h1 className="mt-8 font-[family-name:var(--font-geist-sans)] text-2xl font-semibold text-slate-900">
          Mentions légales
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-600">
          <section>
            <h2 className="font-semibold text-slate-900">Éditeur du site</h2>
            <p className="mt-3">
              Le site « Révision facile » est édité par{" "}
              <strong className="font-medium text-slate-800">Amar</strong>.
            </p>
            <p className="mt-3">
              <strong className="font-medium text-slate-800">Contact :</strong>{" "}
              <a
                href="mailto:amarcontactpro40@gmail.com"
                className="font-medium text-indigo-700 underline decoration-indigo-700/30 underline-offset-2 hover:text-indigo-600"
              >
                amarcontactpro40@gmail.com
              </a>
            </p>
            <p className="mt-3">
              <strong className="font-medium text-slate-800">Responsable de la publication :</strong>{" "}
              Amar.
            </p>
            <p className="mt-3 text-slate-500">
              Si vous êtes assujetti à une obligation d’identification ou de mention d’adresse du
              siège (activité commerciale, société, statut particulier), vous pouvez compléter cette
              page avec votre dénomination juridique complète, votre SIREN/SIRET et votre adresse
              postale — et nous contacter pour mise à jour si besoin.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900">Hébergement</h2>
            <p className="mt-3">
              Le site et l’application sont hébergés par le prestataire choisi par l’éditeur au
              moment de la mise en ligne. Pour les déploiements fréquents d’applications Next.js,
              il peut s’agir notamment de{" "}
              <strong className="font-medium text-slate-800">Vercel Inc.</strong>, 440 N Barranca
              Avenue #4133, Covina, CA 91723, États-Unis —{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-700 underline decoration-indigo-700/30 underline-offset-2 hover:text-indigo-600"
              >
                vercel.com
              </a>
              . Pour connaître l’hébergeur précis du service que vous utilisez, vous pouvez
              contacter l’éditeur aux coordonnées ci-dessus.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900">Propriété intellectuelle</h2>
            <p className="mt-3">
              L’ensemble des éléments composant le site (structure, textes, présentation, marque
              « Révision facile », logo le cas échéant, bases de données lorsqu’elles sont protégeables)
              est la propriété de l’éditeur ou utilisé avec autorisation. Toute reproduction ou
              représentation sans autorisation préalable est interdite, sauf usages autorisés par la
              loi (courtes citations, droit de citation, etc.).
            </p>
            <p className="mt-3">
              Les contenus générés automatiquement pour l’utilisateur (fiches de révision) ont pour
              vocation un usage personnel aux fins d’étude ; l’utilisateur reste responsable de la
              relecture critique et de leur utilisation.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900">Limitation de responsabilité</h2>
            <p className="mt-3">
              Les informations et contenus générés par l’outil le sont à titre d’aide à la
              révision. Ils peuvent comporter des erreurs ou imprécisions malgré les précautions
              prises. L’éditeur ne saurait être tenu responsable d’un usage des contenus contrevenant
              au programme officiel, à un examen, ou aux consignes de votre établissement.
            </p>
            <p className="mt-3">
              L’éditeur met en œuvre des moyens raisonnables pour assurer la disponibilité du
              service mais ne garantit pas une absence totale d’interruption (maintenance, tiers,
              réseau).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900">Liens hypertextes</h2>
            <p className="mt-3">
              Des liens peuvent renvoyer vers des sites tiers ; l’éditeur n’est pas responsable du
              contenu de ces sites. La création de liens vers ce site est soumise à l’information
              préalable de l’éditeur en cas de lien en contexte commercial ou portant atteinte à
              l’image du service.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900">Réclamation et droit applicable</h2>
            <p className="mt-3">
              Pour toute question relative au site ou à son contenu, écrivez à l’adresse indiquée
              ci-dessus. En l’absence de règlement amiable, les tribunaux français sont compétents ;
              le droit applicable est le droit français.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
