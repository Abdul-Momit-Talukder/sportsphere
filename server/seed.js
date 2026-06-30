import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Venue from './models/Venue.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Venue.deleteMany({});

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sportsphere.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    await Venue.insertMany([
      {
        name: 'Central Football Arena',
        sport: 'football',
        description: 'Professional-grade artificial turf football pitch with floodlights and changing rooms.',
        location: '123 Sports Ave, Downtown',
        pricePerHour: 75,
        capacity: 22,
        amenities: ['Floodlights', 'Changing Rooms', 'Parking', 'Water Fountains'],
        openTime: '06:00',
        closeTime: '22:00',
        createdBy: admin._id,
      },
      {
        name: 'Elite Tennis Club',
        sport: 'tennis',
        description: 'Premium hard court tennis facility with coaching available on request.',
        location: '456 Court Lane, Westside',
        pricePerHour: 50,
        capacity: 4,
        amenities: ['Coaching', 'Equipment Rental', 'Cafe', 'Parking'],
        openTime: '07:00',
        closeTime: '21:00',
        createdBy: admin._id,
      },
      {
        name: 'Hoops Basketball Center',
        sport: 'basketball',
        description: 'Indoor basketball court with professional hardwood flooring and scoreboard.',
        location: '789 Hoop Street, Eastside',
        pricePerHour: 60,
        capacity: 10,
        amenities: ['Scoreboard', 'Showers', 'Lockers', 'AC'],
        openTime: '08:00',
        closeTime: '23:00',
        createdBy: admin._id,
      },
      {
        name: 'Aqua Sports Pool',
        sport: 'swimming',
        description: 'Olympic-size swimming pool with lane reservations and lifeguard on duty.',
        location: '321 Wave Blvd, Riverside',
        pricePerHour: 40,
        capacity: 30,
        amenities: ['Lifeguard', 'Showers', 'Lockers', 'Sauna'],
        openTime: '06:00',
        closeTime: '20:00',
        createdBy: admin._id,
      },
    ]);

    console.log('Database seeded successfully!');
    console.log('Admin: admin@sportsphere.com / admin123');
    console.log('User:  john@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
