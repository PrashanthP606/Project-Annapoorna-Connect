import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-teal-600 to-amber-400 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-12 w-12 rounded-full shadow" />
          <span className="text-white font-semibold text-lg">Annapoorna Connect</span>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex gap-6 text-white font-medium">
          <Link to="/">Home</Link>
          <Link to="/foods">Foods</Link>
          <Link to="/donate">Donate</Link>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-teal-700 rounded-md font-semibold shadow hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-yellow-300 text-black rounded-md font-semibold shadow hover:bg-yellow-200"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4 text-white">
              <span>{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded-md shadow hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
