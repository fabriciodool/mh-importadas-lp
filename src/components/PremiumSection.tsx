export default function PremiumSection() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-4">Atendimento especializado</p>
            <h2 className="section-title mb-5 leading-snug">
              Cuidado técnico para equipamentos de alto padrão
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              Eletrodomésticos importados exigem atenção técnica, cuidado na avaliação e
              comunicação clara sobre peças, disponibilidade e viabilidade do serviço.
              A M&H organiza cada solicitação para orientar o cliente com segurança desde
              o primeiro contato.
            </p>
            <p className="text-muted leading-relaxed">
              Cada solicitação é analisada com atenção para orientar o cliente sobre o
              melhor próximo passo, considerando marca, tipo de produto, região de
              atendimento e disponibilidade técnica.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Equipamentos premium", desc: "Atendimento para marcas de alto padrão importadas" },
              { label: "Avaliação organizada", desc: "Processo claro com comunicação antecipada" },
              { label: "Cobertura regional", desc: "São Paulo e regiões selecionadas conforme CEP" },
              { label: "Transparência total", desc: "Orientação clara sobre peças, prazo e viabilidade" },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-white border border-border p-5">
                <div className="w-6 h-0.5 bg-gold mb-3" />
                <h3 className="text-sm font-bold text-ink mb-1.5">{label}</h3>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
