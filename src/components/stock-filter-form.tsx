"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Condition, parseQuery } from "@/lib/parser";
import { filterStocks } from "@/lib/utils";
import { Stock } from "@/types/stock";
import { useEffect, useState } from "react";
import StockTable from "./stock-table";
import { useStockQueryState } from "@/hooks/useStockQueryState";
import { useStockTableState } from "@/hooks/useStockTableState";

const StockFilterForm = () => {
  const { query, setQuery } = useStockQueryState();
  const { setCurrentPage, setSearch } = useStockTableState();
  const [queryInput, setQueryInput] = useState(query || "");
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
    const conditions: Condition[] = parseQuery(queryInput);
    if (conditions.length === 0) {
      setError("No valid conditions found. Please check your query.");
      setFilteredStocks([]);
      return;
    }
    const results = filterStocks(stocks, conditions);
    if (results.length === 0) {
      setFilteredStocks([]);
      setError("No results found.");
    } else {
      setFilteredStocks(results);
      setQuery(queryInput);
      setCurrentPage(1);
      setSearch("");
    }
  };

  useEffect(() => {
    setQueryInput(query);
    if (query) {
      const conditions: Condition[] = parseQuery(query);
      if (conditions.length > 0) {
        const results = filterStocks(stocks, conditions);
        setFilteredStocks(results);
        setError(results.length === 0 ? "No results found." : null);
      } else {
        setFilteredStocks([]);
        setError("No valid conditions found. Please check your query.");
      }
    } else {
      setFilteredStocks([]);
      setError(null);
    }
  }, [query, stocks]);

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          className="w-full"
          rows={4}
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
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
      {query && <StockTable stocks={filteredStocks} />}
    </>
  );
};

export default StockFilterForm;
