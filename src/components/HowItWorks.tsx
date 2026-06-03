const STEPS = [
  { n: "01", title: "Informe os dados", desc: "Preencha marca, produto, nome, WhatsApp e CEP no formulário acima." },
  { n: "02", title: "Recebemos sua solicitação", desc: "A equipe recebe os dados organizados e avalia a solicitação com atenção." },
  { n: "03", title: "Confirmação de disponibilidade", desc: "O atendimento confirma região, disponibilidade técnica e tipo de equipamento." },
  { n: "04", title: "Agendamento da avaliação", desc: "A avaliação técnica é agendada conforme viabilidade e disponibilidade." },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-ink text-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-3">Processo</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
            Como funciona
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
            Simples, organizado e sem burocracia desnecessária.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative">
              {i < STEPS.length - 1 && (
                <span className="hidden md:block absolute top-8 left-full w-full h-px bg-white/10 -translate-y-1/2 z-0" />
              )}
              <div className="relative z-10">
                <span className="text-4xl font-bold text-gold/20 font-serif">{step.n}</span>
                <div className="gold-bar w-8 mt-2 mb-4" />
                <h3 className="text-sm font-bold text-white mb-2 tracking-wide">{step.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
