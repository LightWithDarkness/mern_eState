import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center p-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-8">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
