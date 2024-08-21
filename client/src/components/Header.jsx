import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 sm:px-4">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Kumar</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          action=""
          className="bg-slate-100 p-2.5 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch />
        </form>
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser && currentUser.avatar ? (
              <li>
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="rounded-full w-8 h-8 object-cover"
                />
              </li>
            ) : (
              <li className="text-slate-700 hover:underline">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};
export default Header;
