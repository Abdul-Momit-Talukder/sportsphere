import Venue from '../models/Venue.js';
import { uploadToImgBB } from '../utils/uploadImage.js';

export const getVenues = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.sport) {
      filter.sport = req.query.sport;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const venues = await Venue.find(filter).sort({ createdAt: -1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVenue = async (req, res) => {
  try {
    const { name, sport, description, location, pricePerHour, capacity, amenities, openTime, closeTime } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToImgBB(req.file.buffer, req.file.originalname);
    }

    const amenitiesList = amenities
      ? (typeof amenities === 'string' ? JSON.parse(amenities) : amenities)
      : [];

    const venue = await Venue.create({
      name,
      sport,
      description,
      location,
      pricePerHour: Number(pricePerHour),
      capacity: Number(capacity),
      imageUrl,
      amenities: amenitiesList,
      openTime: openTime || '06:00',
      closeTime: closeTime || '22:00',
      createdBy: req.user._id,
    });

    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const { name, sport, description, location, pricePerHour, capacity, amenities, openTime, closeTime, isActive } = req.body;

    venue.name = name ?? venue.name;
    venue.sport = sport ?? venue.sport;
    venue.description = description ?? venue.description;
    venue.location = location ?? venue.location;
    if (pricePerHour !== undefined) venue.pricePerHour = Number(pricePerHour);
    if (capacity !== undefined) venue.capacity = Number(capacity);
    if (openTime) venue.openTime = openTime;
    if (closeTime) venue.closeTime = closeTime;
    if (isActive !== undefined) venue.isActive = isActive === 'true' || isActive === true;

    if (amenities) {
      venue.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
    }

    if (req.file) {
      venue.imageUrl = await uploadToImgBB(req.file.buffer, req.file.originalname);
    }

    const updatedVenue = await venue.save();
    res.json(updatedVenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    await venue.deleteOne();
    res.json({ message: 'Venue removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVenuesAdmin = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
