"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStockTableState } from "@/hooks/useStockTableState";
import { Stock, columns } from "@/types/stock";
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Pagination from "./pagination";

const itemsPerPage = 10;

const columnLabels: Record<keyof Stock, string> = {
  ticker: "Ticker",
  marketCapitalization: "Market Capitalization (B)",
  peRatio: "P/E Ratio",
  roe: "ROE (%)",
  debtToEquity: "Debt-to-Equity",
  dividendYield: "Dividend Yield (%)",
  revenueGrowth: "Revenue Growth (%)",
  epsGrowth: "EPS Growth (%)",
  currentRatio: "Current Ratio",
  grossMargin: "Gross Margin (%)",
};

const StockTable: React.FC<{ stocks: Stock[] }> = ({ stocks }) => {
  const {
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
  } = useStockTableState();

  const [searchInput, setSearchInput] = useState<string>(search);

  const filteredStocks = useMemo(() => {
    if (!search) return stocks;
    return stocks.filter((stock) =>
      stock.ticker.toLowerCase().includes(search.toLowerCase()),
    );
  }, [stocks, search]);

  const extractTickerNumber = (ticker: string): number => {
    const match = ticker.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const sortedStocks = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredStocks;

    return [...filteredStocks].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (sortKey === "ticker") {
        const aNumber = extractTickerNumber(aValue as string);
        const bNumber = extractTickerNumber(bValue as string);

        if (aNumber < bNumber) return sortDirection === "ascending" ? -1 : 1;
        if (aNumber > bNumber) return sortDirection === "ascending" ? 1 : -1;
        return 0;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [filteredStocks, sortKey, sortDirection]);

  const paginatedStocks = useMemo(() => {
    return sortedStocks.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [sortedStocks, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredStocks.length / itemsPerPage);
  }, [filteredStocks.length]);

  const toggleSort = (key: keyof Stock) => {
    if (sortKey === key) {
      if (sortDirection === "ascending") {
        setSortDirection("descending");
      } else if (sortDirection === "descending") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("ascending");
    }
    setCurrentPage(1);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const getSortIndicator = (columnKey: keyof Stock) => {
    if (sortKey !== columnKey) return null;
    return sortDirection === "ascending" ? (
      <ChevronUpIcon className="ml-2" size={16} aria-hidden />
    ) : (
      <ChevronDownIcon className="ml-2" size={16} aria-hidden />
    );
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1, 2);

      const startPage = Math.max(3, currentPage - 1);
      const endPage = Math.min(currentPage + 1, totalPages - 2);

      if (startPage > 3) pageNumbers.push("...");

      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

      if (endPage < totalPages - 2) pageNumbers.push("...");

      pageNumbers.push(totalPages - 1, totalPages);
    }

    return pageNumbers;
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  if (stocks.length === 0) return null;

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="mb-6 flex items-center gap-2"
        role="search"
        aria-label="Search Stocks by Ticker"
      >
        <Input
          type="text"
          id="search"
          name="search"
          placeholder="Search by Ticker"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-auto"
        />
        <Button
          type="submit"
          variant="expandIcon"
          Icon={<SearchIcon size={16} />}
          iconPlacement="right"
          size="sm"
        >
          Search
        </Button>
      </form>

      <div className="mb-4 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {columns.map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="cursor-pointer border p-2 text-card-foreground"
                  onClick={() => toggleSort(key)}
                  role="columnheader"
                >
                  <div className="flex items-center">
                    {columnLabels[key]}
                    {getSortIndicator(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedStocks.map((stock) => (
              <tr key={stock.ticker} className="hover:bg-secondary">
                {columns.map((key) => (
                  <td key={key} className="border p-2 text-center">
                    {typeof stock[key] === "number"
                      ? stock[key].toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : stock[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        getPageNumbers={getPageNumbers}
        handlePageChange={setCurrentPage}
      />
    </>
  );
};

export default StockTable;
