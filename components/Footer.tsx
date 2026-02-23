export default function Footer() {
  return (
    <footer className="border-t border-forge-border/60 bg-black/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} THE FORGE. Tous droits réservés.</p>
        <div className="flex flex-wrap gap-3">
          <span className="text-slate-600">
            Produit fictif pour démonstration technique.
          </span>
        </div>
      </div>
    </footer>
  );
}

