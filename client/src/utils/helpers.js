const SPORT_ICONS = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
  cricket: '🏏',
  badminton: '🏸',
  swimming: '🏊',
  volleyball: '🏐',
  other: '🏟️',
};

export const getSportIcon = (sport) => SPORT_ICONS[sport] || '🏟️';

export const SPORT_OPTIONS = [
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'cricket', label: 'Cricket' },
  { value: 'badminton', label: 'Badminton' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'volleyball', label: 'Volleyball' },
  { value: 'other', label: 'Other' },
];

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};
