import { useQueryState } from "nuqs";

export const useStockQueryState = () => {
  const [query, setQuery] = useQueryState<string>("query", {
    defaultValue: "",
    parse: (value) => decodeURIComponent(value as string),
    serialize: (value) => encodeURIComponent(value || ""),
    history: "push",
  });

  return { query, setQuery };
};
