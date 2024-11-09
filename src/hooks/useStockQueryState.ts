import { useQueryState } from "nuqs";

export const useStockQueryState = () => {
  const [query, setQuery] = useQueryState("query", {
    defaultValue: "",
    parse: (value) => (typeof value === "string" ? value : ""),
    serialize: (value) => value,
    history: "push",
    persist: true,
  });

  return { query, setQuery };
};
