export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="print:hidden border-t border-slate-200/80 bg-slate-50/90">
      <div className="mx-auto max-w-6xl px-5 py-8 text-center">
        <p className="text-xs text-slate-500">© {year} Révision facile</p>
      </div>
    </footer>
  );
}
