const JobDescriptionDetailsSkeleton = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto mt-20 shadow-xl rounded-lg bg-white">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 -mx-6 -mt-6 px-6 py-8 rounded-t-lg border-b border-t-black-primary">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-72 bg-gray-300 rounded mb-3"></div>
            <div className="h-5 w-32 bg-gray-300 rounded"></div>
          </div>
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <div className="space-y-8 mt-8">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <div className="h-5 w-60 bg-gray-300 rounded"></div>
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-6 py-6 bg-white rounded-b-lg">
              <ul className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-400 mt-2"></div>
                    <div className="h-5 w-80 bg-gray-300 rounded"></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobDescriptionDetailsSkeleton;
