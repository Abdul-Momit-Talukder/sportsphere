import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <span className="text-xl font-bold text-primary-700">SportSphere</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/venues" className={linkClass}>
            Venues
          </NavLink>
          {user && (
            <NavLink to="/bookings" className={linkClass}>
              My Bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="hidden text-sm text-gray-600 hover:text-primary-600 sm:block"
              >
                {user.name}
              </Link>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
