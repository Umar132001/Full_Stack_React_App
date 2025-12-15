import { Link } from "react-router-dom";

export default function Header() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <header className="bg-indigo-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">John Doe</h1>

        <nav className="space-x-4">
          <Link to="/home" className="hover:underline">
            Home
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>

          {isLoggedIn ? (
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
