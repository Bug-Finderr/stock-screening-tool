"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stock } from "@/types/stock";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type SortDirection = "ascending" | "descending";

type SortConfig = {
  key: keyof Stock;
  direction: SortDirection;
} | null;

const StockTable: React.FC<{ stocks: Stock[] }> = ({ stocks }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parsePage = (value: string | null): number => {
    const parsed = parseInt(value || "1", 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  };

  const parseSearch = (value: string | null): string => {
    return value ? value.trim() : "";
  };

  const parseSortKey = (value: string | null): keyof Stock | null => {
    if (!value) return null;
    return value as keyof Stock;
  };

  const parseSortDirection = (value: string | null): SortDirection | null => {
    if (value === "ascending" || value === "descending") {
      return value;
    }
    return null;
  };

  const initialPage = useMemo(
    () => parsePage(searchParams.get("page")),
    [searchParams],
  );
  const initialSearch = useMemo(
    () => parseSearch(searchParams.get("search")),
    [searchParams],
  );
  const initialSortKey = useMemo(
    () => parseSortKey(searchParams.get("sortKey")),
    [searchParams],
  );
  const initialSortDirection = useMemo(
    () => parseSortDirection(searchParams.get("sortDirection")),
    [searchParams],
  );

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    initialSortKey && initialSortDirection
      ? { key: initialSortKey, direction: initialSortDirection }
      : null,
  );

  const itemsPerPage = 10;

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", currentPage.toString());

    if (searchTerm) {
      params.set("search", searchTerm);
    }

    if (sortConfig) {
      params.set("sortKey", sortConfig.key);
      params.set("sortDirection", sortConfig.direction);
    }

    router.push(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, sortConfig]);

  useEffect(() => {
    const page = parsePage(searchParams.get("page"));
    const search = parseSearch(searchParams.get("search"));
    const sortKey = parseSortKey(searchParams.get("sortKey"));
    const sortDirection = parseSortDirection(searchParams.get("sortDirection"));

    if (page !== currentPage) {
      setCurrentPage(page);
    }

    if (search !== searchTerm) {
      setSearchTerm(search);
      setSearchInput(search);
    }

    if (
      sortKey &&
      sortDirection &&
      (!sortConfig ||
        sortConfig.key !== sortKey ||
        sortConfig.direction !== sortDirection)
    ) {
      setSortConfig({ key: sortKey, direction: sortDirection });
    } else if (!sortKey || !sortDirection) {
      setSortConfig(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    return stocks.filter((stock) =>
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [stocks, searchTerm]);

  const sortedStocks = useMemo(() => {
    if (sortConfig === null) {
      return filteredStocks;
    }

    const sorted = [...filteredStocks].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "number" && typeof bValue === "number") {
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue, undefined, {
          sensitivity: "base",
        });
        return sortConfig.direction === "ascending" ? comparison : -comparison;
      } else {
        return 0;
      }
    });

    return sorted;
  }, [filteredStocks, sortConfig]);

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
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig?.key === key) {
        if (prevSortConfig.direction === "ascending") {
          return { key, direction: "descending" };
        } else if (prevSortConfig.direction === "descending") {
          return null;
        }
      }
      return { key, direction: "ascending" };
    });
    setCurrentPage(1);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
    const direction =
      sortConfig?.key === columnKey ? sortConfig.direction : null;

    switch (direction) {
      case "ascending":
        return <ChevronUpIcon className="ml-2" size={16} aria-hidden />;
      case "descending":
        return <ChevronDownIcon className="ml-2" size={16} aria-hidden />;
      default:
        return null;
    }
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
                    sortConfig?.key === key
                      ? sortConfig.direction === "ascending"
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

      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="hidden gap-2 md:flex">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First Page"
          >
            First
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            Previous
          </Button>

          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 py-1">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page as number)}
                aria-label={`Page ${page}`}
              >
                {page}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            Next
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last Page"
          >
            Last
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First Page"
          >
            <ChevronFirstIcon size={18} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <ChevronLeftIcon size={18} />
          </Button>

          <span className="px-2 py-1">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            <ChevronRightIcon size={18} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last Page"
          >
            <ChevronLastIcon size={18} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default StockTable;
