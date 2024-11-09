import { Stock } from "./stock";

export interface Condition {
  field: keyof Omit<Stock, "ticker">;
  operator: ">" | "<" | "=";
  value: number;
}
