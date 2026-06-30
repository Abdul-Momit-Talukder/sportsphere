import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <span className="font-bold text-primary-700">SportSphere</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SportSphere. Book your game, play your way.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="/venues" className="hover:text-primary-600">
              Venues
            </Link>
            <Link to="/bookings" className="hover:text-primary-600">
              Bookings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
