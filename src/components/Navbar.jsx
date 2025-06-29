import { useState} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = (path) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition ${
      location.pathname === path
        ? "bg-indigo-700 text-white"
        : "text-gray-200 hover:bg-indigo-600 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-white tracking-wide hover:text-yellow-300 transition"
          >
            DebMate
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={linkClasses("/")}>Home</Link>
            <Link to="/add-loan" className={linkClasses("/add-loan")}>Add Loan</Link>
            <Link to="/all-loans" className={linkClasses("/all-loans")}>All Loans</Link>

            {user ? (
              <>
                <span className="text-white text-sm">👤 {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg--500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-white text-indigo-700 hover:bg-gray-100 px-3 py-1 rounded text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-white text-indigo-700 hover:bg-gray-100 px-3 py-1 rounded text-sm font-medium">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className={linkClasses("/")}>Home</Link>
            <Link to="/add-loan" onClick={() => setIsOpen(false)} className={linkClasses("/add-loan")}>Add Loan</Link>
            <Link to="/all-loans" onClick={() => setIsOpen(false)} className={linkClasses("/all-loans")}>All Loans</Link>

            {user ? (
              <>
                <span className="text-white block px-3">👤 {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block text-indigo-700 bg-white hover:bg-gray-100 px-3 py-2 rounded text-sm">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block text-indigo-700 bg-white hover:bg-gray-100 px-3 py-2 rounded text-sm">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
