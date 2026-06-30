import { useEffect, useState } from 'react';
import { venueAPI } from '../services/api';
import VenueCard from '../components/VenueCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { SPORT_OPTIONS } from '../utils/helpers';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const params = {};
        if (sport) params.sport = sport;
        if (search) params.search = search;
        const { data } = await venueAPI.getAll(params);
        setVenues(data);
      } catch {
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchVenues, 300);
    return () => clearTimeout(debounce);
  }, [sport, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sports Venues</h1>
        <p className="mt-2 text-gray-500">Find the perfect venue for your next game</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name or location..."
          className="input-field flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-field sm:w-48"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          <option value="">All Sports</option>
          {SPORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : venues.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">No venues found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Venues;
