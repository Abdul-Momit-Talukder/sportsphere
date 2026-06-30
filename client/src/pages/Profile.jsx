import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = { name: form.name, email: form.email };
      if (form.password) data.password = form.password;
      await updateProfile(data);
      toast.success('Profile updated');
      setForm({ ...form, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      <p className="mt-2 text-gray-500">Manage your account settings</p>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            minLength={6}
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {form.password && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              minLength={6}
              className="input-field"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>
        )}
        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          Role: <span className="font-medium capitalize">{user?.role}</span>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <LoadingSpinner size="sm" /> : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
