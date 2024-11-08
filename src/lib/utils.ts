import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Stock } from "@/types/stock";
import { Condition } from "./parser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filterStocks = (
  stocks: Stock[],
  conditions: Condition[],
): Stock[] => {
  return stocks.filter((stock) =>
    conditions.every(({ field, operator, value }) => {
      const stockValue = stock[field];
      if (typeof stockValue !== "number") return false;

      const operations = {
        ">": stockValue > value,
        "<": stockValue < value,
        "=": stockValue === value,
      };

      return operations[operator] ?? false;
    }),
  );
};
