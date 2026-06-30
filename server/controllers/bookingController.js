import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import { generateTimeSlots, calculateHours } from '../utils/timeSlots.js';

export const getBookings = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('venue', 'name sport location imageUrl')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('venue');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { venueId, date } = req.query;

    if (!venueId || !date) {
      return res.status(400).json({ message: 'Venue ID and date are required' });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const allSlots = generateTimeSlots(venue.openTime, venue.closeTime);

    const existingBookings = await Booking.find({
      venue: venueId,
      date: bookingDate,
      status: { $ne: 'cancelled' },
    });

    const bookedTimes = existingBookings.map((b) => b.startTime);

    const availableSlots = allSlots.map((slot) => ({
      ...slot,
      available: !bookedTimes.includes(slot.startTime),
      price: venue.pricePerHour * calculateHours(slot.startTime, slot.endTime),
    }));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { venueId, date, startTime, endTime, notes } = req.body;

    if (!venueId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const venue = await Venue.findById(venueId);
    if (!venue || !venue.isActive) {
      return res.status(404).json({ message: 'Venue not found or inactive' });
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({ message: 'Cannot book for past dates' });
    }

    const existingBooking = await Booking.findOne({
      venue: venueId,
      date: bookingDate,
      startTime,
      status: { $ne: 'cancelled' },
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const hours = calculateHours(startTime, endTime);
    const totalPrice = venue.pricePerHour * hours;

    const booking = await Booking.create({
      user: req.user._id,
      venue: venueId,
      date: bookingDate,
      startTime,
      endTime,
      totalPrice,
      notes: notes || '',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('venue', 'name sport location imageUrl')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.status) {
      if (req.body.status === 'cancelled' || isAdmin) {
        booking.status = req.body.status;
      } else {
        return res.status(400).json({ message: 'Invalid status update' });
      }
    }

    if (req.body.notes !== undefined) {
      booking.notes = req.body.notes;
    }

    const updatedBooking = await booking.save();
    const populated = await Booking.findById(updatedBooking._id)
      .populate('venue', 'name sport location imageUrl')
      .populate('user', 'name email');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
