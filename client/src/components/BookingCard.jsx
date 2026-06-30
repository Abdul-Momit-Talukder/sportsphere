import { STATUS_COLORS, formatDate, formatPrice, getSportIcon } from '../utils/helpers';

const BookingCard = ({ booking, onCancel, showUser = false }) => {
  return (
    <div className="card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-2xl">
            {booking.venue?.imageUrl ? (
              <img
                src={booking.venue.imageUrl}
                alt={booking.venue.name}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              getSportIcon(booking.venue?.sport)
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{booking.venue?.name}</h3>
            <p className="text-sm text-gray-500">{booking.venue?.location}</p>
            <p className="mt-1 text-sm text-gray-600">
              {formatDate(booking.date)} &middot; {booking.startTime} - {booking.endTime}
            </p>
            {showUser && booking.user && (
              <p className="mt-1 text-xs text-gray-400">
                Booked by: {booking.user.name} ({booking.user.email})
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className={`badge capitalize ${STATUS_COLORS[booking.status]}`}>
            {booking.status}
          </span>
          <span className="font-semibold text-primary-600">
            {formatPrice(booking.totalPrice)}
          </span>
          {booking.status === 'confirmed' && onCancel && (
            <button onClick={() => onCancel(booking._id)} className="btn-danger text-xs">
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
