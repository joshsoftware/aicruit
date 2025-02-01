function JobDescriptionTableSkeleton() {
  return (
    <div className="border overflow-hidden mt-20">
      <table className="w-full">
        <thead className="bg-gray-primary">
          <tr>
            <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
              ID
            </th>
            <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
              Job Title
            </th>
            <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
              Status
            </th>
            <th className="px-6 py-2 text-right text-sm font-medium text-gray-dark">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-2 text-sm text-black-tertiary">
                <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-2 text-sm text-black-tertiary">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-2 text-sm text-black-tertiary">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-2 text-right text-sm">
                <div className="flex justify-end space-x-4">
                  <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default JobDescriptionTableSkeleton;
