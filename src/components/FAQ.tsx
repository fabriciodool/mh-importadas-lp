"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "A M&H é autorizada das marcas citadas?",
    a: "As marcas são citadas para identificação dos equipamentos atendidos. A M&H atua como assistência técnica independente, salvo quando houver autorização formal comprovada.",
  },
  {
    q: "Quais equipamentos importados vocês atendem?",
    a: "Atendemos refrigeradores, side by side, freezers, adegas, fornos, cooktops, rangetops, coifas, lava-louças, lavadoras, secadoras, máquinas de gelo e equipamentos gourmet, conforme marca, modelo e disponibilidade técnica.",
  },
  {
    q: "Vocês atendem equipamentos na garantia?",
    a: "Para equipamentos em garantia de fábrica, o ideal é consultar o fabricante ou a rede autorizada oficial. A M&H realiza atendimentos técnicos independentes conforme o caso.",
  },
  {
    q: "Preciso informar o modelo do equipamento?",
    a: "Nesta primeira etapa, basta informar marca, produto, nome, WhatsApp e CEP. A equipe poderá solicitar modelo e detalhes adicionais no atendimento.",
  },
  {
    q: "O atendimento é feito no local?",
    a: "Em muitos casos, sim. A confirmação depende da região, do tipo de equipamento e da avaliação inicial.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-3">Dúvidas frequentes</p>
          <h2 className="section-title">Perguntas frequentes</h2>
        </div>

        <div className="divide-y divide-border">
          {ITEMS.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 py-5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <span className="text-sm font-semibold text-ink group-hover:text-gold transition-colors duration-150">
                  {item.q}
                </span>
                <span className={`text-gold flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>
                  ✚
                </span>
              </button>
              {open === i && (
                <p className="pb-5 text-sm text-muted leading-relaxed animate-fade-up">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
