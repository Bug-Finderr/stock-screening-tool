import { useQueryState } from "nuqs";
import { Stock } from "@/types/stock";

type SortDirection = "ascending" | "descending" | "";

export const useStockTableState = () => {
  const [sortKey, setSortKey] = useQueryState<keyof Stock | null>("sortKey", {
    defaultValue: null,
    parse: (value) =>
      typeof value === "string" ? (value as keyof Stock) : null,
    serialize: (value) => value || "",
    history: "push",
    persist: true,
  });

  const [sortDirection, setSortDirection] = useQueryState<SortDirection | null>(
    "sortDirection",
    {
      defaultValue: null,
      parse: (value) =>
        value === "ascending" || value === "descending" ? value : null,
      serialize: (value) => value || "",
      history: "push",
      persist: true,
    },
  );

  const [currentPage, setCurrentPage] = useQueryState<number>("page", {
    defaultValue: 1,
    parse: (value) => parseInt(value as string, 10) || 1,
    serialize: (value) => value.toString(),
    history: "push",
    persist: true,
  });

  const [search, setSearch] = useQueryState<string>("search", {
    defaultValue: "",
    parse: (value) => (typeof value === "string" ? value : ""),
    serialize: (value) => value,
    history: "push",
    persist: true,
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
