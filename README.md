# SportSphere

A full-stack MERN sports venue booking platform. Browse venues, book time slots, and manage reservations — with JWT cookie authentication and an admin dashboard for venue CRUD.

## Features

- **User Authentication** — Register, login, logout with JWT stored in HTTP-only cookies
- **Venue Browsing** — Search and filter sports venues by type and location
- **Time Slot Booking** — Real-time availability checking and booking confirmation
- **My Bookings** — View and cancel your reservations
- **Admin Dashboard** — Full CRUD for venues, view all bookings, image upload via ImgBB
- **Responsive UI** — Tailwind CSS with mobile-friendly design

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS        |
| Backend  | Node.js, Express                    |
| Database | MongoDB, Mongoose                   |
| Auth     | JWT (HTTP-only cookies), bcryptjs   |
| Images   | ImgBB API                           |
| Deploy   | Vercel                              |

## Project Structure

```
sportsphere/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API client (axios)
│   │   └── utils/          # Helpers
│   └── ...
├── server/                 # Express backend
│   ├── config/             # Database connection
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth & error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Token, time slots, image upload
│   └── seed.js             # Database seeder
├── vercel.json             # Vercel deployment config
├── .env.example            # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- ImgBB API key ([get one free](https://api.imgbb.com/))

### Installation

1. **Clone and install dependencies**

   ```bash
   cd sportsphere
   npm run install:all
   ```

2. **Configure environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example server/.env
   cp client/.env.example client/.env
   ```

   Edit `server/.env`:

   ```env
   PORT=5000
   MONGODB_URI=your_connection_string
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRES_IN=7d
   IMGBB_KEY=your_imgbb_key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Seed the database** (optional)

   ```bash
   node server/seed.js
   ```

   This creates sample venues and test accounts:
   - Admin: `admin@sportsphere.com` / `admin123`
   - User: `john@example.com` / `password123`

4. **Run the development servers**

   In separate terminals:

   ```bash
   npm run dev:server
   npm run dev:client
   ```

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## API Endpoints

### Auth
| Method | Endpoint            | Description       | Auth     |
| ------ | ------------------- | ----------------- | -------- |
| POST   | `/api/auth/register`| Register user     | Public   |
| POST   | `/api/auth/login`   | Login user        | Public   |
| POST   | `/api/auth/logout`  | Logout user       | Public   |
| GET    | `/api/auth/me`      | Get current user  | Required |
| PUT    | `/api/auth/profile` | Update profile    | Required |

### Venues
| Method | Endpoint                | Description         | Auth        |
| ------ | ----------------------- | ------------------- | ----------- |
| GET    | `/api/venues`           | List active venues  | Public      |
| GET    | `/api/venues/:id`       | Get venue details   | Public      |
| GET    | `/api/venues/admin/all` | List all venues     | Admin       |
| POST   | `/api/venues`           | Create venue        | Admin       |
| PUT    | `/api/venues/:id`       | Update venue        | Admin       |
| DELETE | `/api/venues/:id`       | Delete venue        | Admin       |

### Bookings
| Method | Endpoint              | Description           | Auth     |
| ------ | --------------------- | --------------------- | -------- |
| GET    | `/api/bookings/slots` | Get available slots   | Public   |
| GET    | `/api/bookings`       | List bookings         | Required |
| GET    | `/api/bookings/:id`   | Get booking details   | Required |
| POST   | `/api/bookings`       | Create booking        | Required |
| PUT    | `/api/bookings/:id`   | Update booking status | Required |
| DELETE | `/api/bookings/:id`   | Delete booking        | Required |

## Deployment (Vercel)

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set environment variables in the Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `IMGBB_KEY`
   - `CLIENT_URL` (your Vercel deployment URL)
   - `NODE_ENV=production`
4. Set the client build command: `cd client && npm install && npm run build`
5. Deploy

The `vercel.json` routes `/api/*` to the Express server and all other paths to the React SPA.

## Pages

| Route            | Page              | Access   |
| ---------------- | ----------------- | -------- |
| `/`              | Home              | Public   |
| `/login`         | Login             | Public   |
| `/register`      | Register          | Public   |
| `/venues`        | Venue Listing     | Public   |
| `/venues/:id`    | Venue Detail      | Public   |
| `/bookings`      | My Bookings       | Auth     |
| `/profile`       | User Profile      | Auth     |
| `/admin`         | Admin Dashboard   | Admin    |

## License

MIT
