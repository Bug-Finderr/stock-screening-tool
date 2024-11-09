export interface Stock {
  ticker: string;
  marketCapitalization: number;
  peRatio: number;
  roe: number;
  debtToEquity: number;
  dividendYield: number;
  revenueGrowth: number;
  epsGrowth: number;
  currentRatio: number;
  grossMargin: number;
}

export const columns: (keyof Stock)[] = [
  "ticker",
  "marketCapitalization",
  "peRatio",
  "roe",
  "debtToEquity",
  "dividendYield",
  "revenueGrowth",
  "epsGrowth",
  "currentRatio",
  "grossMargin",
];
