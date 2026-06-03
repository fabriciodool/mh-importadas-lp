const PRODUCTS_DATA = [
  { icon: "❄", label: "Refrigeradores importados" },
  { icon: "↔", label: "Side by Side" },
  { icon: "◻", label: "Freezers" },
  { icon: "♦", label: "Adegas climatizadas" },
  { icon: "◈", label: "Fornos e embutidos" },
  { icon: "▦", label: "Cooktops e rangetops" },
  { icon: "↑", label: "Coifas" },
  { icon: "◉", label: "Lava-louças" },
  { icon: "◎", label: "Lavadoras e secadoras" },
  { icon: "▣", label: "Churrasqueiras" },
  { icon: "✦", label: "Máquinas de gelo" },
  { icon: "◐", label: "Equipamentos gourmet" },
];

export default function ProductsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-3">Cobertura técnica</p>
          <h2 className="section-title mb-3">Equipamentos importados atendidos</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Refrigeradores, side by side, adegas, fornos, cooktops, coifas, lava-louças,
            lavadoras, secadoras, máquinas de gelo e equipamentos gourmet.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {PRODUCTS_DATA.map(({ icon, label }) => (
            <div
              key={label}
              className="card flex flex-col items-center text-center gap-3 py-6"
            >
              <span className="text-2xl text-gold" aria-hidden="true">{icon}</span>
              <span className="text-xs font-semibold text-ink leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
