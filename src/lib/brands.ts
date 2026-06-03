export const BRANDS: string[] = [
  "AGA",
  "Amana",
  "Ariston",
  "Asko",
  "Bauknecht",
  "Bertazzoni",
  "Best",
  "Dacor",
  "DCS",
  "Elettromec",
  "Elica",
  "Faber",
  "Fagor",
  "Frigidaire",
  "Gaggenau",
  "GE Monogram",
  "Gladiator",
  "Gorenje",
  "Hotpoint",
  "Ilve",
  "Jenn-Air",
  "Kelvinator",
  "Kenmore",
  "KitchenAid",
  "Liebherr",
  "Lofra",
  "Marvel",
  "Maytag",
  "Miele",
  "Smeg",
  "Speed Queen",
  "Sub Zero",
  "Tecno",
  "Thermador",
  "U-line",
  "Viking",
  "Weber",
  "Whirlpool",
  "Wolf",
];

export const FEATURED_BRANDS: string[] = [
  "Sub Zero",
  "Viking",
  "Wolf",
  "Thermador",
  "Gaggenau",
  "Miele",
  "Smeg",
  "KitchenAid",
  "GE Monogram",
  "Liebherr",
  "Dacor",
  "Jenn-Air",
  "Elettromec",
];

export function normalizeBrand(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function searchBrands(query: string): string[] {
  if (!query.trim()) return [];
  const normalized = normalizeBrand(query);
  const starts: string[] = [];
  const contains: string[] = [];
  for (const brand of BRANDS) {
    const nb = normalizeBrand(brand);
    if (nb.startsWith(normalized)) starts.push(brand);
    else if (nb.includes(normalized)) contains.push(brand);
  }
  return [...starts, ...contains].slice(0, 8);
}

export function isValidBrand(value: string): boolean {
  const normalized = normalizeBrand(value);
  return BRANDS.some((b) => normalizeBrand(b) === normalized);
}

export function getOfficialBrand(value: string): string | null {
  const normalized = normalizeBrand(value);
  return BRANDS.find((b) => normalizeBrand(b) === normalized) ?? null;
}
