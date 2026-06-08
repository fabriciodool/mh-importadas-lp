"use client";

import { useState, useRef, useEffect } from "react";
import { BRANDS } from "@/lib/brands";
import { getProductsForBrand } from "@/lib/brand-products";

interface FormData {
  marca: string;
  produto: string;
  nome: string;
  whatsapp: string;
  cep: string;
}

interface Errors {
  marca?: string;
  produto?: string;
  nome?: string;
  whatsapp?: string;
  cep?: string;
}

function formatWhatsApp(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatCEP(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

const INVALID_PHONES = ["00000000000", "11111111111", "22222222222", "33333333333",
  "44444444444", "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"];

function getUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"];
  const result: Record<string, string> = {};
  keys.forEach((k) => { const v = p.get(k); if (v) result[k] = v; });
  return result;
}

export default function LeadForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormData>({ marca: "", produto: "", nome: "", whatsapp: "", cep: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [cepAddress, setCepAddress] = useState<{ logradouro?: string; bairro?: string; localidade?: string; uf?: string } | null>(null);
  const [cepFetching, setCepFetching] = useState(false);
  const honeyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!started && (form.marca || form.produto)) {
      setStarted(true);
      window.dataLayer?.push({ event: "lead_form_start", lp: "mh-importadas" });
    }
  }, [form, started]);

  useEffect(() => {
    const digits = form.cep.replace(/\D/g, "");
    if (digits.length !== 8) { setCepAddress(null); return; }
    setCepFetching(true);
    const controller = new AbortController();
    fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => { setCepAddress(data.erro ? null : data); })
      .catch(() => { setCepAddress(null); })
      .finally(() => { setCepFetching(false); });
    return () => controller.abort();
  }, [form.cep]);

  const validateStep1 = (): Errors => {
    const e: Errors = {};
    if (!form.marca) e.marca = "Selecione uma marca";
    if (!form.produto) e.produto = "Selecione o equipamento";
    return e;
  };

  const validateStep2 = (): Errors => {
    const e: Errors = {};
    const nome = form.nome.replace(/\s+/g, " ").trim();
    if (!nome || nome.length < 2) e.nome = "Informe seu nome completo";
    if (/^\d+$/.test(nome)) e.nome = "Nome inválido";
    const digits = form.whatsapp.replace(/\D/g, "");
    if (!digits || (digits.length !== 10 && digits.length !== 11)) e.whatsapp = "WhatsApp inválido";
    if (INVALID_PHONES.includes(digits)) e.whatsapp = "WhatsApp inválido";
    const cepDigits = form.cep.replace(/\D/g, "");
    if (!cepDigits || cepDigits.length !== 8) e.cep = "CEP inválido";
    return e;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeyRef.current?.value) return;
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setSubmitError(null);

    const utms = getUTMParams();
    const payload = {
      lp: "mh-importadas",
      marca: form.marca,
      produto: form.produto,
      nome: form.nome.replace(/\s+/g, " ").trim(),
      whatsapp: form.whatsapp.replace(/\D/g, ""),
      cep: form.cep.replace(/\D/g, ""),
      utm_source: utms.utm_source ?? "",
      utm_medium: utms.utm_medium ?? "",
      utm_campaign: utms.utm_campaign ?? "",
      utm_term: utms.utm_term ?? "",
      utm_content: utms.utm_content ?? "",
      gclid: utms.gclid ?? "",
      gbraid: utms.gbraid ?? "",
      wbraid: utms.wbraid ?? "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      landing_page: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        window.dataLayer?.push({ event: "lead_form_submit_success", lp: "mh-importadas", brand: form.marca, product: form.produto });
        window.dataLayer?.push({ event: "whatsapp_redirect", lp: "mh-importadas", brand: form.marca, product: form.produto });
        window.location.href = data.redirectUrl;
      } else {
        setSubmitError(data.message ?? "Erro ao enviar. Tente novamente.");
        setLoading(false);
      }
    } catch {
      setSubmitError("Erro de conexão. Verifique sua internet e tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div aria-label="Formulário de solicitação de atendimento">
      <input ref={honeyRef} name="_gotcha" type="text" tabIndex={-1} className="honeypot" aria-hidden="true" />

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-5">
        <button
          type="button"
          onClick={() => { if (step === 2) { setStep(1); setErrors({}); } }}
          className={`flex-1 pb-2.5 text-xs font-semibold tracking-widest uppercase text-center border-b-2 transition-colors duration-200 ${
            step === 1 ? "border-gold text-ink" : "border-border text-muted hover:text-ink cursor-pointer"
          }`}
        >
          <span className="inline-flex items-center gap-1.5 justify-center">
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${step === 1 ? "bg-gold text-white" : "bg-green-600 text-white"}`}>
              {step === 2 ? "✓" : "1"}
            </span>
            Equipamento
          </span>
        </button>
        <div className="w-4 h-px bg-border mx-1 flex-shrink-0" />
        <div className={`flex-1 pb-2.5 text-xs font-semibold tracking-widest uppercase text-center border-b-2 transition-colors duration-200 ${
          step === 2 ? "border-gold text-ink" : "border-border text-muted"
        }`}>
          <span className="inline-flex items-center gap-1.5 justify-center">
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${step === 2 ? "bg-gold text-white" : "bg-border text-muted"}`}>
              2
            </span>
            Seus dados
          </span>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleContinue} noValidate className="space-y-4">
          <div>
            <label htmlFor="marca" className="field-label">Marca do equipamento *</label>
            <div className="relative">
              <select
                id="marca"
                name="marca"
                value={form.marca}
                onChange={(e) => { setForm((f) => ({ ...f, marca: e.target.value, produto: "" })); setErrors((er) => ({ ...er, marca: undefined, produto: undefined })); }}
                aria-invalid={!!errors.marca}
                className={`field-input appearance-none cursor-pointer pr-10 ${errors.marca ? "border-red-500" : form.marca ? "border-green-600" : ""}`}
              >
                <option value="">Selecione a marca</option>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                {form.marca ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </div>
            {errors.marca && <p role="alert" className="field-error">{errors.marca}</p>}
          </div>

          <div>
            <label htmlFor="produto" className="field-label">Produto *</label>
            <div className="relative">
              <select
                id="produto"
                name="produto"
                value={form.produto}
                disabled={!form.marca}
                onChange={(e) => { setForm((f) => ({ ...f, produto: e.target.value })); setErrors((er) => ({ ...er, produto: undefined })); }}
                aria-invalid={!!errors.produto}
                className={`field-input appearance-none cursor-pointer pr-10 disabled:opacity-50 disabled:cursor-not-allowed ${errors.produto ? "border-red-500" : form.produto ? "border-green-600" : ""}`}
              >
                <option value="">{form.marca ? "Selecione o equipamento" : "Selecione a marca primeiro"}</option>
                {getProductsForBrand(form.marca).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                {form.produto ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </div>
            {errors.produto && <p role="alert" className="field-error">{errors.produto}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gold text-white font-semibold text-sm tracking-wide sm:tracking-widest uppercase py-4 transition-all duration-200 hover:bg-gold-light active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            Continuar
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Summary of step 1 */}
          <div className="flex items-center justify-between bg-surface border border-border px-4 py-2.5">
            <div className="text-xs text-muted">
              <span className="font-semibold text-ink">{form.marca}</span>
              <span className="mx-1.5 text-border">·</span>
              <span>{form.produto}</span>
            </div>
            <button
              type="button"
              onClick={() => { setStep(1); setErrors({}); }}
              className="text-xs text-gold font-semibold hover:text-gold-light transition-colors duration-150 ml-2 flex-shrink-0"
            >
              Alterar
            </button>
          </div>

          <div>
            <label htmlFor="nome" className="field-label">Nome *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Seu nome completo"
              value={form.nome}
              onChange={(e) => { setForm((f) => ({ ...f, nome: e.target.value })); setErrors((er) => ({ ...er, nome: undefined })); }}
              aria-invalid={!!errors.nome}
              className={`field-input ${errors.nome ? "border-red-500" : ""}`}
            />
            {errors.nome && <p role="alert" className="field-error">{errors.nome}</p>}
          </div>

          <div>
            <label htmlFor="whatsapp" className="field-label">WhatsApp *</label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              placeholder="(11) 99999-9999"
              value={form.whatsapp}
              onChange={(e) => { setForm((f) => ({ ...f, whatsapp: formatWhatsApp(e.target.value) })); setErrors((er) => ({ ...er, whatsapp: undefined })); }}
              aria-invalid={!!errors.whatsapp}
              className={`field-input ${errors.whatsapp ? "border-red-500" : ""}`}
            />
            {errors.whatsapp && <p role="alert" className="field-error">{errors.whatsapp}</p>}
          </div>

          <div>
            <label htmlFor="cep" className="field-label">CEP de atendimento *</label>
            <input
              id="cep"
              name="cep"
              type="text"
              autoComplete="postal-code"
              inputMode="numeric"
              placeholder="00000-000"
              value={form.cep}
              onChange={(e) => { setForm((f) => ({ ...f, cep: formatCEP(e.target.value) })); setErrors((er) => ({ ...er, cep: undefined })); }}
              aria-invalid={!!errors.cep}
              className={`field-input ${errors.cep ? "border-red-500" : ""}`}
            />
            {errors.cep && <p role="alert" className="field-error">{errors.cep}</p>}
            {cepFetching && (
              <p className="text-xs text-muted mt-1 flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Buscando endereço...
              </p>
            )}
            {!cepFetching && cepAddress && (
              <p className="text-xs text-green-700 mt-1 flex items-start gap-1">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {[cepAddress.logradouro, cepAddress.bairro, `${cepAddress.localidade}/${cepAddress.uf}`].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>

          {submitError && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-white font-semibold text-sm tracking-wide sm:tracking-widest uppercase py-4 transition-all duration-200 hover:bg-gold-light active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Enviando...
              </span>
            ) : (
              "Solicitar atendimento"
            )}
          </button>

          <p className="text-xs text-muted text-center leading-relaxed">
            Ao enviar, você autoriza o contato da equipe M&H pelo WhatsApp informado para tratar da sua solicitação de atendimento técnico.
          </p>
        </form>
      )}
    </div>
  );
}
