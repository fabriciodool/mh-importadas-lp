import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white py-12">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          <div>
            <Logo inverted className="h-12 w-auto mb-4" />
            <p className="text-white/50 text-xs leading-relaxed">
              Assistência técnica especializada em eletrodomésticos importados e de alto padrão.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">Atendimento</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              São Paulo e regiões selecionadas conforme disponibilidade técnica e confirmação do CEP.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">Legal</h3>
            <ul className="space-y-2">
              {["Política de Privacidade", "Termos de Uso", "Aviso Legal"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/60 text-xs hover:text-gold transition-colors duration-150">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {year} M&H Assistência Eletrodoméstico Importados. Todos os direitos reservados.
          </p>
          <p className="text-white/20 text-xs text-center max-w-md leading-relaxed">
            As marcas citadas são utilizadas apenas para identificação dos equipamentos atendidos.
            A M&H presta assistência técnica independente, salvo quando houver autorização formal comprovada.
          </p>
        </div>
      </div>
    </footer>
  );
}
