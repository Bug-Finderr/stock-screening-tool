import { Condition } from "@/types/condition";
import { Stock } from "@/types/stock";

const FIELD_MAP: Record<string, keyof Omit<Stock, "ticker">> = {
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

export const parseQuery = (query: string): Condition[] => {
  return query
    .split(/AND/i)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.+?)\s*(>|<|=)\s*(\d+\.?\d*)$/i);
      if (match) {
        const [, fieldName, operator, valueStr] = match;
        const field = FIELD_MAP[fieldName.trim().toLowerCase()];
        const value = parseFloat(valueStr);
        if (field && [">", "<", "="].includes(operator)) {
          return { field, operator: operator as Condition["operator"], value };
        }
      }
      return null;
    })
    .filter((condition): condition is Condition => condition !== null);
};
