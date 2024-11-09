"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stock } from "@/types/stock";
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "lucide-react";
import { FormEvent, useMemo, useState, useEffect } from "react";
import Pagination from "./pagination";
import { useStockTableState } from "@/hooks/useStockTableState";

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

  const itemsPerPage = 10;

  const filteredStocks = useMemo(() => {
    if (!search) return stocks;
    return stocks.filter((stock) =>
      stock.ticker.toLowerCase().includes(search.toLowerCase()),
    );
  }, [stocks, search]);

  const extractTickerNumber = (ticker: string): number => {
    const match = ticker.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
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
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue, undefined, {
          sensitivity: "base",
        });
        return sortDirection === "ascending" ? comparison : -comparison;
      } else {
        return 0;
      }
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

  const requestSort = (key: keyof Stock) => {
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

  const [searchInput, setSearchInput] = useState(search);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  if (stocks.length === 0) return <>No results found.</>;

  const columns: (keyof Stock)[] = [
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
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1, 2);

      const startPage = Math.max(3, currentPage - 1);
      const endPage = Math.min(currentPage + 1, totalPages - 2);

      if (startPage > 3) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 2) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages - 1, totalPages);
    }

    return pageNumbers;
  };

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
                  onClick={() => requestSort(key)}
                  aria-sort={
                    sortKey === key
                      ? sortDirection === "ascending"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
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
