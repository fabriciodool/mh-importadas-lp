import LeadForm from "./LeadForm";

export default function FormCTA() {
  return (
    <section className="py-16 md:py-20 bg-surface" id="solicitar">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-3">Solicite agora</p>
          <h2 className="section-title mb-3">Pronto para agendar?</h2>
          <p className="section-subtitle">
            Preencha o formulário e siga para o WhatsApp com sua solicitação já estruturada.
          </p>
        </div>
        <div className="bg-white border border-border p-8 md:p-10 shadow-sm">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
