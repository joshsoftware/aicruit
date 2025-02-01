const JobDescriptionDetailsSkeleton = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto mt-20 shadow-lg rounded-lg bg-white">
      <div className="bg-indigo-400 -mx-6 -mt-6 px-6 py-8 rounded-t-lg border-b border-t-black-primary">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-6 w-48 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <div className="space-y-6 mt-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <div className="h-4 w-40 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-4 py-4 bg-white rounded-b-lg">
              <ul className="space-y-2">
                {[...Array(3)].map((_, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="mr-3 mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-300"></div>
                    <div className="h-4 w-60 bg-gray-300 rounded"></div>
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
