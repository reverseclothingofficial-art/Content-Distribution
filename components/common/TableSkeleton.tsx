export default function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-white border border-gray-300">
      <table className="table-auto w-full">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="p-4 text-left">No</th>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Video</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-gray-300">
              <td className="p-4">
                <div className="h-4 w-6 bg-gray-200 animate-pulse rounded" />
              </td>

              <td className="p-4">
                <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
              </td>

              <td className="p-4">
                <div className="h-20 w-20 bg-gray-200 animate-pulse rounded-md" />
              </td>

              <td className="p-4">
                <div className="h-20 w-20 bg-gray-200 animate-pulse rounded-md" />
              </td>

              <td className="p-4 space-x-2 min-w-50">
                <div className="h-8 w-8 inline-block bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-8 inline-block bg-gray-200 animate-pulse rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
