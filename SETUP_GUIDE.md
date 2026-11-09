# Backend Setup Guide

## Quick Start

### Step 1: Install Dependencies

Run this to install all required packages:

```bash
npm install
```

### Step 2: Setup MongoDB

You have two options:

#### Option A: Local MongoDB

1. Install MongoDB Community: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/rideshare`

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Use format: `mongodb+srv://username:password@cluster.mongodb.net/rideshare?retryWrites=true&w=majority`

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your values:

```
MONGODB_URI=mongodb://localhost:27017/rideshare
JWT_SECRET=super-secret-key-min-32-characters-long!
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to confirm it's running.

## API Testing

### Using Postman

1. **Register User:**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register`
   - Body (JSON):

   ```json
   {
     "email": "test@university.edu",
     "password": "testPassword123",
     "firstName": "Test",
     "lastName": "User",
     "phone": "+1234567890",
     "gender": "male",
     "role": "passenger"
   }
   ```

2. **Login:**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`
   - Body:

   ```json
   {
     "email": "test@university.edu",
     "password": "testPassword123"
   }
   ```

   - Copy the token from response

3. **Create Ride (requires Auth token):**
   - Method: POST
   - URL: `http://localhost:3000/api/rides`
   - Headers:
     ```
     Authorization: Bearer <your_token>
     Content-Type: application/json
     ```
   - Body:
   ```json
   {
     "origin": {
       "address": "University Main Gate",
       "latitude": 40.7128,
       "longitude": -74.006
     },
     "destination": {
       "address": "Downtown Station",
       "latitude": 40.758,
       "longitude": -73.9855
     },
     "departureTime": "2024-05-15T08:00:00Z",
     "totalSeats": 4,
     "pricePerSeat": 5,
     "genderPolicy": "any"
   }
   ```

## Common Issues

### "Cannot connect to MongoDB"

- Make sure MongoDB is running
- Check MONGODB_URI in .env.local
- Verify network access if using Atlas

### "JWT_SECRET is not defined"

- Add JWT_SECRET to .env.local
- Must be at least 32 characters for security

### "Module not found"

- Run `npm install` again
- Delete node_modules and package-lock.json, then reinstall

## Project Structure

```
app/
├── api/
│   ├── auth/          # Authentication routes
│   ├── admin/         # Admin management routes
│   ├── bookings/      # Booking management
│   ├── profile/       # User profile endpoints
│   ├── reviews/       # Review endpoints
│   └── rides/         # Ride management
├── layout.tsx         # Root layout
└── page.tsx          # Home page

lib/
├── auth.ts           # Authentication utilities
├── db.ts             # Database connection
├── safety.ts         # Safety validation (existing)
├── api.ts            # API client helpers (existing)
└── models/           # Database models
    ├── User.ts
    ├── Ride.ts
    ├── Booking.ts
    └── Review.ts
```

## Database Schema

The app uses MongoDB with these main collections:

- **Users** - User profiles with verification status
- **Rides** - Posted rides with driver and vehicle info
- **Bookings** - Ride bookings and payment tracking
- **Reviews** - User reviews and ratings

## Next Steps

1. **Frontend Integration:**
   - Update API endpoints in frontend components
   - Add token storage (localStorage or cookies)
   - Add authentication context

2. **Additional Features:**
   - Email verification (send verification links)
   - Password reset flow
   - Payment integration
   - Real-time notifications
   - Chat messaging

3. **Security Hardening:**
   - Add rate limiting
   - Enable CORS properly
   - Add input sanitization
   - Add API request logging

4. **Testing:**
   - Write unit tests for models
   - Write integration tests for API routes
   - Set up CI/CD pipeline

## Useful Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Start development with hot reload
npm run dev
```

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- Mongoose Docs: https://mongoosejs.com
- TypeScript Docs: https://www.typescriptlang.org/docs

---

**Need Help?** Check API_DOCUMENTATION.md for detailed endpoint documentation.
