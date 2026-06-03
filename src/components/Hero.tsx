import LeadForm from "./LeadForm";

const BENEFITS = [
  { icon: "◆", text: "Atendimento para marcas importadas" },
  { icon: "◆", text: "Avaliação técnica mediante agendamento" },
  { icon: "◆", text: "Suporte para equipamentos premium" },
  { icon: "◆", text: "Comunicação clara antes da execução" },
  { icon: "◆", text: "São Paulo e regiões selecionadas" },
];

export default function Hero() {
  return (
    <section className="hero-bg lg:min-h-screen pt-16 md:pt-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #B8965A 0%, transparent 60%)" }}
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="text-white order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-6 h-px bg-gold" />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold">
                Especialistas em importados
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-6">
              Assistência técnica para{" "}
              <span className="text-gold">eletrodomésticos importados</span>
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
              Solicite atendimento para equipamentos premium de marcas importadas, com
              avaliação técnica organizada conforme marca, produto e região de atendimento.
            </p>

            <ul className="space-y-2.5 mb-8">
              {BENEFITS.map((b) => (
                <li key={b.text} className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="text-gold text-xs">{b.icon}</span>
                  {b.text}
                </li>
              ))}
            </ul>

            <p className="text-white/40 text-xs italic">
              Sub Zero · Viking · Wolf · Gaggenau · Miele · Smeg · KitchenAid
            </p>
          </div>

          <div id="formulario" className="bg-white p-5 md:p-8 lg:p-10 shadow-2xl order-1 lg:order-2">
            <div className="mb-6">
              <h2 className="text-ink text-lg font-bold tracking-tight mb-1">
                Solicite seu atendimento
              </h2>
              <p className="text-muted text-xs leading-relaxed">
                Preencha os dados e siga para o WhatsApp com sua solicitação já estruturada.
              </p>
              <div className="gold-bar mt-4" />
            </div>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
