import { Stock, columns } from "@/types/stock";
import { useQueryState } from "nuqs";

type SortDirection = "ascending" | "descending" | "";

export const useStockTableState = () => {
  const [sortKey, setSortKey] = useQueryState<keyof Stock | null>("sortKey", {
    defaultValue: null,
    parse: (value) =>
      columns.includes(value as keyof Stock) ? (value as keyof Stock) : null,
    history: "push",
  });

  const [sortDirection, setSortDirection] = useQueryState<SortDirection>(
    "sortDirection",
    {
      defaultValue: "",
      parse: (value) => value as SortDirection,
      history: "push",
    },
  );

  const [currentPage, setCurrentPage] = useQueryState<number>("page", {
    defaultValue: 1,
    parse: Number,
    history: "push",
  });

  const [search, setSearch] = useQueryState<string>("search", {
    defaultValue: "",
    parse: String,
    history: "push",
  });

  return {
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
  };
};
