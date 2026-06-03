import { FEATURED_BRANDS } from "@/lib/brands";

const SCROLL_BRANDS = [...FEATURED_BRANDS, ...FEATURED_BRANDS];

export default function BrandsSection() {
  return (
    <section className="py-16 md:py-20 bg-surface border-y border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-8 mb-10 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-3">Marcas atendidas</p>
        <h2 className="section-title mb-3">Marcas importadas e premium</h2>
        <p className="section-subtitle max-w-xl mx-auto">
          Atendimento técnico para equipamentos importados de alto padrão, conforme marca,
          modelo, disponibilidade de peças e viabilidade técnica.
        </p>
      </div>

      <div className="relative overflow-hidden" aria-hidden="true">
        <div className="brands-scroll">
          {SCROLL_BRANDS.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="inline-block px-6 py-2 text-sm font-semibold tracking-wider text-ink/60 border border-border bg-white hover:border-gold hover:text-gold transition-colors duration-200 cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 mt-8">
        <p className="text-center text-xs text-muted italic max-w-2xl mx-auto leading-relaxed">
          As marcas citadas são utilizadas apenas para identificação dos equipamentos atendidos.
          A M&H presta assistência técnica independente, salvo quando houver autorização formal comprovada.
        </p>
      </div>
    </section>
  );
}
