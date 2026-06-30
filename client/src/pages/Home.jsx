import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { venueAPI } from '../services/api';
import VenueCard from '../components/VenueCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data } = await venueAPI.getAll();
        setVenues(data.slice(0, 6));
      } catch {
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Book Sports Venues Instantly
            </h1>
            <p className="mt-4 text-lg text-primary-100">
              Find and reserve football pitches, tennis courts, basketball arenas, and more.
              SportSphere makes booking your next game effortless.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/venues" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
                Browse Venues
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-lg border-2 border-white px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured Venues</h2>
          <Link to="/venues" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all &rarr;
          </Link>
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
          <p className="text-center text-gray-500">No venues available yet. Check back soon!</p>
        )}
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: '1', title: 'Browse Venues', desc: 'Explore sports venues by type, location, and price.' },
              { step: '2', title: 'Pick a Slot', desc: 'Choose your date and available time slot.' },
              { step: '3', title: 'Book & Play', desc: 'Confirm your booking and hit the field!' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
