import StockFilterForm from "@/components/stock-filter-form";

export default function Home() {
  return (
    <div className="md:py-auto container mx-auto px-4 pt-6">
      <h1 className="mb-4 text-2xl font-bold">Stock Screening Tool</h1>
      <StockFilterForm />
    </div>
  );
}
