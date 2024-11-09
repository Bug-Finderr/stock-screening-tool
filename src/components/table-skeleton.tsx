import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => {
  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-9 w-full sm:w-[200px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>

      <div className="mb-4 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {[...Array(10)].map((_, i) => (
                <th key={i} className="border p-2">
                  <Skeleton className="h-6 w-full" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(10)].map((_, colIndex) => (
                  <td key={colIndex} className="border p-2">
                    <Skeleton className="mx-auto h-6 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-9" />
        ))}
      </div>
    </>
  );
};

export default TableSkeleton;
