import { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getAll();
      setBookings(data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingAPI.update(id, { status: 'cancelled' });
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
      <p className="mt-2 text-gray-500">Manage your venue reservations</p>

      <div className="mt-8 space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
          ))
        ) : (
          <div className="card py-12 text-center">
            <p className="text-gray-500">You haven&apos;t made any bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
