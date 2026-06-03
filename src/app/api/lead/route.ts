import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isValidBrand } from "@/lib/brands";
import { PRODUCTS } from "@/lib/products";

const INVALID_PHONES = new Set([
  "00000000000", "11111111111", "22222222222", "33333333333",
  "44444444444", "55555555555", "66666666666", "77777777777",
  "88888888888", "99999999999",
]);

const rateLimitMap = new Map<string, { count: number; ts: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 5;

function rateCheck(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.ts > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[<>"'`]/g, "").trim().slice(0, 500);
}

function formatPhone(digits: string): string {
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return digits;
}

function formatCEP(digits: string): string {
  return digits.length === 8 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  const origin = req.headers.get("origin") ?? "";
  if (allowedOrigin && origin && origin !== allowedOrigin) {
    return NextResponse.json({ success: false, message: "Origem não permitida." }, { status: 403 });
  }

  if (!rateCheck(ip)) {
    return NextResponse.json({ success: false, message: "Muitas solicitações. Aguarde um momento e tente novamente." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Dados inválidos." }, { status: 400 });
  }

  const marca = sanitize(body.marca);
  const produto = sanitize(body.produto);
  const nome = sanitize(body.nome).replace(/\s+/g, " ");
  const whatsapp = sanitize(body.whatsapp).replace(/\D/g, "");
  const cep = sanitize(body.cep).replace(/\D/g, "");

  if (!isValidBrand(marca)) return NextResponse.json({ success: false, message: "Marca inválida." }, { status: 422 });
  if (!PRODUCTS.includes(produto)) return NextResponse.json({ success: false, message: "Produto inválido." }, { status: 422 });
  if (!nome || nome.length < 2 || /^\d+$/.test(nome)) return NextResponse.json({ success: false, message: "Nome inválido." }, { status: 422 });
  if (!whatsapp || (whatsapp.length !== 10 && whatsapp.length !== 11) || INVALID_PHONES.has(whatsapp)) return NextResponse.json({ success: false, message: "WhatsApp inválido." }, { status: 422 });
  if (!cep || cep.length !== 8) return NextResponse.json({ success: false, message: "CEP inválido." }, { status: 422 });

  const utms = {
    utm_source: sanitize(body.utm_source),
    utm_medium: sanitize(body.utm_medium),
    utm_campaign: sanitize(body.utm_campaign),
    utm_term: sanitize(body.utm_term),
    utm_content: sanitize(body.utm_content),
    gclid: sanitize(body.gclid),
    gbraid: sanitize(body.gbraid),
    wbraid: sanitize(body.wbraid),
    referrer: sanitize(body.referrer),
    landing_page: sanitize(body.landing_page),
    timestamp: new Date().toISOString(),
  };

  const wFormatted = formatPhone(whatsapp);
  const cepFormatted = formatCEP(cep);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: process.env.SMTP_SECURE !== "false",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const textBody = `Novo lead recebido pela LP M&H - Marcas Importadas

Marca: ${marca}
Produto: ${produto}
Nome: ${nome}
WhatsApp: ${wFormatted}
CEP de atendimento: ${cepFormatted}

Origem:
LP: mh-importadas
URL da página: ${utms.landing_page}
Referrer: ${utms.referrer}
UTM Source: ${utms.utm_source}
UTM Medium: ${utms.utm_medium}
UTM Campaign: ${utms.utm_campaign}
UTM Term: ${utms.utm_term}
UTM Content: ${utms.utm_content}
GCLID: ${utms.gclid}
GBRAID: ${utms.gbraid}
WBRAID: ${utms.wbraid}
Data/hora: ${utms.timestamp}`;

    const htmlBody = `<!DOCTYPE html><html lang="pt-BR"><body style="font-family:Arial,sans-serif;color:#0A0A0A;max-width:600px;margin:0 auto;padding:24px">
<h2 style="border-bottom:3px solid #B8965A;padding-bottom:8px;margin-bottom:16px">Novo lead — LP M&H Importados</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px">
<tr><td style="padding:6px 12px;background:#F5F4F1;font-weight:600;width:40%">Marca</td><td style="padding:6px 12px;border-bottom:1px solid #E5E3DF">${marca}</td></tr>
<tr><td style="padding:6px 12px;background:#F5F4F1;font-weight:600">Produto</td><td style="padding:6px 12px;border-bottom:1px solid #E5E3DF">${produto}</td></tr>
<tr><td style="padding:6px 12px;background:#F5F4F1;font-weight:600">Nome</td><td style="padding:6px 12px;border-bottom:1px solid #E5E3DF">${nome}</td></tr>
<tr><td style="padding:6px 12px;background:#F5F4F1;font-weight:600">WhatsApp</td><td style="padding:6px 12px;border-bottom:1px solid #E5E3DF">${wFormatted}</td></tr>
<tr><td style="padding:6px 12px;background:#F5F4F1;font-weight:600">CEP</td><td style="padding:6px 12px;border-bottom:1px solid #E5E3DF">${cepFormatted}</td></tr>
</table>
<h3 style="font-size:12px;color:#6B6B6B;text-transform:uppercase;letter-spacing:2px">Origem</h3>
<table style="width:100%;border-collapse:collapse;font-size:12px;color:#6B6B6B">
${Object.entries({ LP: "mh-importadas", URL: utms.landing_page, Referrer: utms.referrer, "UTM Source": utms.utm_source, "UTM Medium": utms.utm_medium, "UTM Campaign": utms.utm_campaign, "GCLID": utms.gclid, "Data/hora": utms.timestamp })
  .filter(([, v]) => v)
  .map(([k, v]) => `<tr><td style="padding:3px 8px;font-weight:600">${k}</td><td style="padding:3px 8px">${v}</td></tr>`)
  .join("")}
</table>
</body></html>`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? "M&H Leads <nao-responda@dominio.com.br>",
      to: process.env.LEAD_EMAIL_TO ?? "contato@abastec.com.br",
      subject: `[Lead LP M&H Importados] ${marca} - ${produto} - CEP ${cepFormatted}`,
      text: textBody,
      html: htmlBody,
    });
  } catch (err) {
    console.error("SMTP error:", err);
  }

  const waNumber = process.env.WHATSAPP_NUMBER_MH ?? "5511999999999";
  const waMessage = encodeURIComponent(
    `Olá, vim pela página da M&H e quero solicitar atendimento técnico para eletrodoméstico importado.\n\nMarca: ${marca}\nProduto: ${produto}\nNome: ${nome}\nWhatsApp: ${wFormatted}\nCEP de atendimento: ${cepFormatted}\n\nAguardo retorno para agendar uma avaliação técnica.`
  );

  return NextResponse.json({
    success: true,
    redirectUrl: `https://wa.me/${waNumber}?text=${waMessage}`,
  });
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const allowed = process.env.ALLOWED_ORIGIN ?? "";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowed || origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
