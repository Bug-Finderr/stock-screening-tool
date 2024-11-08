"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Condition, parseQuery } from "@/lib/parser";
import { filterStocks } from "@/lib/utils";
import { Stock } from "@/types/stock";
import { useEffect, useState } from "react";
import StockTable from "./stock-table";

const StockFilterForm = () => {
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("/api/stocks");
        const data: Stock[] = await response.json();
        setStocks(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchStocks();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const conditions: Condition[] = parseQuery(query);
    if (conditions.length === 0) {
      setError("No valid conditions found. Please check your query.");
      setFilteredStocks([]);
      return;
    }
    const results = filterStocks(stocks, conditions);
    setFilteredStocks(results);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          className="w-full"
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Example Query:
Market Capitalization > 10000 AND
ROE > 15 AND
P/E Ratio < 20`}
        />
        <Button type="submit" variant="gooeyLeft" className="mt-4">
          Run Query
        </Button>
      </form>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <StockTable stocks={filteredStocks} />
    </>
  );
};

export default StockFilterForm;
