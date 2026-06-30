import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { venueAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSportIcon, formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const VenueDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const { data } = await venueAPI.getById(id);
        setVenue(data);
      } catch {
        toast.error('Venue not found');
        navigate('/venues');
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id, navigate]);

  useEffect(() => {
    if (!selectedDate || !id) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSelectedSlot(null);
      try {
        const { data } = await bookingAPI.getAvailableSlots(id, selectedDate);
        setSlots(data);
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    setBooking(true);
    try {
      await bookingAPI.create({
        venueId: id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes,
      });
      toast.success('Booking confirmed!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <LoadingSpinner fullScreen />;
  if (!venue) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-xl bg-gray-100">
            {venue.imageUrl ? (
              <img src={venue.imageUrl} alt={venue.name} className="h-80 w-full object-cover" />
            ) : (
              <div className="flex h-80 items-center justify-center text-8xl">
                {getSportIcon(venue.sport)}
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
                <p className="mt-1 capitalize text-gray-500">{venue.sport}</p>
              </div>
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(venue.pricePerHour)}/hr
              </span>
            </div>

            <p className="mt-4 text-gray-600">{venue.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Location</span>
                <p className="font-medium">{venue.location}</p>
              </div>
              <div>
                <span className="text-gray-500">Capacity</span>
                <p className="font-medium">{venue.capacity} players</p>
              </div>
              <div>
                <span className="text-gray-500">Hours</span>
                <p className="font-medium">
                  {venue.openTime} - {venue.closeTime}
                </p>
              </div>
            </div>

            {venue.amenities?.length > 0 && (
              <div className="mt-6">
                <span className="text-sm text-gray-500">Amenities</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {venue.amenities.map((a) => (
                    <span key={a} className="badge bg-gray-100 text-gray-700">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card h-fit">
          <h2 className="text-xl font-bold text-gray-900">Book This Venue</h2>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Select Date</label>
            <input
              type="date"
              min={today}
              className="input-field"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {selectedDate && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Available Time Slots
              </label>
              {slotsLoading ? (
                <LoadingSpinner />
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.startTime}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${
                        !slot.available
                          ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 line-through'
                          : selectedSlot?.startTime === slot.startTime
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                      <br />
                      <span className="text-xs">{formatPrice(slot.price)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No slots available</p>
              )}
            </div>
          )}

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests..."
            />
          </div>

          {selectedSlot && (
            <div className="mt-4 rounded-lg bg-primary-50 p-4">
              <p className="text-sm text-primary-800">
                Total: <span className="font-bold">{formatPrice(selectedSlot.price)}</span>
              </p>
            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={!selectedSlot || booking}
            className="btn-primary mt-6 w-full"
          >
            {booking ? <LoadingSpinner size="sm" /> : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
