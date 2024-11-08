import { Stock } from "@/types/stock";

export interface Condition {
  field: keyof Omit<Stock, "ticker">;
  operator: ">" | "<" | "=";
  value: number;
}

export const parseQuery = (query: string): Condition[] => {
  const conditions: Condition[] = [];
  const lines = query
    .split(/\n|AND/i)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const match = line.match(/^(.+?)\s*(>|<|=)\s*(\d+\.?\d*)$/i);
    if (match) {
      const [, fieldName, operator, valueStr] = match;
      const field = mapFieldName(fieldName.trim());
      const value = parseFloat(valueStr);
      if (field && [">", "<", "="].includes(operator)) {
        conditions.push({
          field,
          operator: operator as Condition["operator"],
          value,
        });
      }
    }
  }
  return conditions;
};

const mapFieldName = (name: string): keyof Omit<Stock, "ticker"> | null => {
  const fieldMap: Record<string, keyof Omit<Stock, "ticker">> = {
    "market capitalization": "marketCapitalization",
    "p/e ratio": "peRatio",
    roe: "roe",
    "debt-to-equity ratio": "debtToEquity",
    "dividend yield": "dividendYield",
    "revenue growth": "revenueGrowth",
    "eps growth": "epsGrowth",
    "current ratio": "currentRatio",
    "gross margin": "grossMargin",
  };
  return fieldMap[name.toLowerCase()] || null;
};
