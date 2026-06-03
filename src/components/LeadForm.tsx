"use client";

import { useState, useRef, useEffect } from "react";
import BrandAutocomplete from "./BrandAutocomplete";
import { PRODUCTS } from "@/lib/products";

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
  keys.forEach((k) => {
    const v = p.get(k);
    if (v) result[k] = v;
  });
  return result;
}

export default function LeadForm() {
  const [form, setForm] = useState<FormData>({ marca: "", produto: "", nome: "", whatsapp: "", cep: "" });
  const [validBrand, setValidBrand] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const honeyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!started && (form.marca || form.produto || form.nome || form.whatsapp || form.cep)) {
      setStarted(true);
      window.dataLayer?.push({ event: "lead_form_start", lp: "mh-importadas" });
    }
  }, [form, started]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!validBrand) e.marca = "Selecione uma marca da lista";
    if (!form.produto) e.produto = "Selecione um produto";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeyRef.current?.value) return;
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setSubmitError(null);

    const utms = getUTMParams();
    const payload = {
      lp: "mh-importadas",
      marca: validBrand!,
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
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        window.dataLayer?.push({ event: "lead_form_submit_success", lp: "mh-importadas", brand: validBrand, product: form.produto });
        window.dataLayer?.push({ event: "whatsapp_redirect", lp: "mh-importadas", brand: validBrand, product: form.produto });
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Formulário de solicitação de atendimento">
      <input ref={honeyRef} name="_gotcha" type="text" tabIndex={-1} className="honeypot" aria-hidden="true" />

      <BrandAutocomplete
        value={form.marca}
        onChange={(v) => setForm((f) => ({ ...f, marca: v }))}
        onValidBrand={(b) => { setValidBrand(b); if (b) setErrors((e) => ({ ...e, marca: undefined })); }}
        error={errors.marca}
      />

      <div>
        <label htmlFor="produto" className="field-label">Produto *</label>
        <select
          id="produto"
          name="produto"
          value={form.produto}
          onChange={(e) => { setForm((f) => ({ ...f, produto: e.target.value })); setErrors((er) => ({ ...er, produto: undefined })); }}
          aria-invalid={!!errors.produto}
          className={`field-input appearance-none cursor-pointer ${errors.produto ? "border-red-500" : ""}`}
        >
          <option value="">Selecione o equipamento</option>
          {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.produto && <p role="alert" className="field-error">{errors.produto}</p>}
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
      </div>

      {submitError && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold text-white font-semibold text-sm tracking-widest uppercase py-4 transition-all duration-200 hover:bg-gold-light active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
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
          "Solicitar atendimento para importado"
        )}
      </button>

      <p className="text-xs text-muted text-center leading-relaxed">
        Ao enviar, você autoriza o contato da equipe M&H pelo WhatsApp informado para tratar da sua solicitação de atendimento técnico.
      </p>
    </form>
  );
}
