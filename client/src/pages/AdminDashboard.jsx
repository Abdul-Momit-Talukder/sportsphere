import { useEffect, useState } from 'react';
import { venueAPI, bookingAPI } from '../services/api';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { SPORT_OPTIONS, formatPrice, getSportIcon } from '../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [tab, setTab] = useState('venues');
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    name: '',
    sport: 'football',
    description: '',
    location: '',
    pricePerHour: '',
    capacity: '',
    amenities: '',
    openTime: '06:00',
    closeTime: '22:00',
    isActive: true,
    image: null,
  };

  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [venuesRes, bookingsRes] = await Promise.all([
        venueAPI.getAllAdmin(),
        bookingAPI.getAll(),
      ]);
      setVenues(venuesRes.data);
      setBookings(bookingsRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingVenue(null);
    setShowForm(false);
  };

  const openEdit = (venue) => {
    setEditingVenue(venue);
    setForm({
      name: venue.name,
      sport: venue.sport,
      description: venue.description,
      location: venue.location,
      pricePerHour: venue.pricePerHour,
      capacity: venue.capacity,
      amenities: venue.amenities?.join(', ') || '',
      openTime: venue.openTime,
      closeTime: venue.closeTime,
      isActive: venue.isActive,
      image: null,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('sport', form.sport);
      formData.append('description', form.description);
      formData.append('location', form.location);
      formData.append('pricePerHour', form.pricePerHour);
      formData.append('capacity', form.capacity);
      formData.append('openTime', form.openTime);
      formData.append('closeTime', form.closeTime);
      formData.append('isActive', form.isActive);

      const amenitiesArr = form.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);
      formData.append('amenities', JSON.stringify(amenitiesArr));

      if (form.image) {
        formData.append('image', form.image);
      }

      if (editingVenue) {
        await venueAPI.update(editingVenue._id, formData);
        toast.success('Venue updated');
      } else {
        await venueAPI.create(formData);
        toast.success('Venue created');
      }

      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this venue? This cannot be undone.')) return;

    try {
      await venueAPI.delete(id);
      toast.success('Venue deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-500">Manage venues and view all bookings</p>
        </div>
        {tab === 'venues' && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add Venue
          </button>
        )}
      </div>

      <div className="mt-6 flex gap-4 border-b border-gray-200">
        {['venues', 'bookings'].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              resetForm();
            }}
            className={`border-b-2 px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'venues' && showForm && (
        <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {editingVenue ? 'Edit Venue' : 'Create New Venue'}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                required
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Sport</label>
              <select
                className="input-field"
                value={form.sport}
                onChange={(e) => setForm({ ...form, sport: e.target.value })}
              >
                {SPORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                required
                className="input-field"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Location</label>
              <input
                required
                className="input-field"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Price per Hour ($)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                className="input-field"
                value={form.pricePerHour}
                onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Capacity</label>
              <input
                required
                type="number"
                min="1"
                className="input-field"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Amenities (comma-separated)</label>
              <input
                className="input-field"
                placeholder="Parking, Showers, Lighting"
                value={form.amenities}
                onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Open Time</label>
              <input
                type="time"
                className="input-field"
                value={form.openTime}
                onChange={(e) => setForm({ ...form, openTime: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Close Time</label>
              <input
                type="time"
                className="input-field"
                value={form.closeTime}
                onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                className="input-field"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              />
            </div>
            {editingVenue && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <LoadingSpinner size="sm" /> : editingVenue ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {tab === 'venues' && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="pb-3 pr-4">Venue</th>
                <th className="pb-3 pr-4">Sport</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Price/hr</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue) => (
                <tr key={venue._id} className="border-b border-gray-100">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span>{getSportIcon(venue.sport)}</span>
                      {venue.name}
                    </div>
                  </td>
                  <td className="py-3 pr-4 capitalize">{venue.sport}</td>
                  <td className="py-3 pr-4">{venue.location}</td>
                  <td className="py-3 pr-4">{formatPrice(venue.pricePerHour)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`badge ${venue.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {venue.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(venue)} className="text-primary-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(venue._id)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {venues.length === 0 && (
            <p className="py-8 text-center text-gray-500">No venues yet. Create one to get started.</p>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="mt-6 space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} showUser />
            ))
          ) : (
            <div className="card py-12 text-center">
              <p className="text-gray-500">No bookings yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
