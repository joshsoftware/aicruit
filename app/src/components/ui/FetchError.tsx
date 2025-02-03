const FetchError = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="p-6 bg-white shadow-lg rounded-lg border border-red-300">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-700">
          We couldn't load the data. Please try again later.
        </p>
      </div>
    </div>
  );
};

export default FetchError;
