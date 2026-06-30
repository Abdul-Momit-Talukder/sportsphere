import { Link } from 'react-router-dom';
import { getSportIcon, formatPrice } from '../utils/helpers';

const VenueCard = ({ venue }) => {
  return (
    <Link
      to={`/venues/${venue._id}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            {getSportIcon(venue.sport)}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium capitalize">
          {venue.sport}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
          {venue.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{venue.location}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary-600">
            {formatPrice(venue.pricePerHour)}/hr
          </span>
          <span className="text-xs text-gray-400">Up to {venue.capacity} players</span>
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;
