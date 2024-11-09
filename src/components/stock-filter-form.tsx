"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStockQueryState } from "@/hooks/useStockQueryState";
import { useStockTableState } from "@/hooks/useStockTableState";
import { parseQuery } from "@/lib/parser";
import { filterStocks } from "@/lib/utils";
import { Condition } from "@/types/condition";
import { Stock } from "@/types/stock";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import StockTable from "./stock-table";
import TableSkeleton from "./table-skeleton";

const StockFilterForm = () => {
  const { query, setQuery } = useStockQueryState();
  const { setCurrentPage, setSearch } = useStockTableState();
  const [queryInput, setQueryInput] = useState<string>(query || "");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const conditions: Condition[] = parseQuery(queryInput);
    if (conditions.length === 0) {
      setError("No valid conditions found. Please check your query.");
      setFilteredStocks([]);
      setIsLoading(false);
      return;
    }
    const results = filterStocks(stocks, conditions);
    if (results.length === 0) {
      setFilteredStocks([]);
      setError("No matching results found.");
    } else {
      setFilteredStocks(results);
      setQuery(queryInput);
      setCurrentPage(1);
      setSearch("");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchStocks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/stocks");
        const data: Stock[] = await response.json();
        setStocks(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStocks();
  }, []);

  // For browser reloads, to persist
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
        <Button
          type="submit"
          variant="gooeyLeft"
          className="mt-4"
          disabled={isLoading}
        >
          Run Query
        </Button>
      </form>
      {!isLoading && error && (
        <Alert
          variant={
            error === "No matching results found." ? "default" : "destructive"
          }
        >
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            {error === "No matching results found." ? "Sorry!" : "Error"}
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {query &&
        (isLoading ? (
          <TableSkeleton />
        ) : (
          <StockTable stocks={filteredStocks} />
        ))}
    </>
  );
};

export default StockFilterForm;
