# RideShare Backend API Documentation

## Overview

This is a complete backend implementation for a university carpool mobile app built with Next.js, TypeScript, Mongoose, and MongoDB.

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB instance
- Environment variables configured

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your MongoDB URI and JWT secret:

```
MONGODB_URI=mongodb://localhost:27017/rideshare
JWT_SECRET=your-super-secret-key-change-in-production
```

4. Run development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## Database Models

### User Model

- Email, password, name, phone, gender
- Verification status (email, student ID)
- Role: driver, passenger, admin
- Rating and ride count
- Preferences (smoking, pets, music, chat preference)
- Emergency contact

### Ride Model

- Driver info and vehicle details
- Origin and destination (address + coordinates)
- Departure time and availability
- Pricing and gender policy
- Amenities and rules
- Status tracking

### Booking Model

- Ride and passenger references
- Payment status tracking
- Completion and cancellation details
- Seat numbers

### Review Model

- Rating (1-5 stars)
- Category ratings (communication, cleanliness, driving, safety)
- Review type (driver or passenger)

## API Endpoints

### Authentication

#### Register

- **POST** `/api/auth/register`
- **Request:**

```json
{
  "email": "user@university.edu",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "male",
  "role": "passenger"
}
```

- **Response:** User object + JWT token

#### Login

- **POST** `/api/auth/login`
- **Request:**

```json
{
  "email": "user@university.edu",
  "password": "securepassword"
}
```

- **Response:** User object + JWT token

#### Forgot Password

- **POST** `/api/auth/forgot-password`
- **Request:**

```json
{
  "email": "user@university.edu"
}
```

- **Response:** Success message (doesn't reveal if email exists)

### Profile Management

#### Get Profile

- **GET** `/api/profile` - Get current user's profile
- **GET** `/api/profile/[userId]` - Get specific user's profile
- **Response:** User object + reviews

#### Update Profile

- **PUT** `/api/profile`
- **Request:**

```json
{
  "firstName": "Jane",
  "profileImage": "url",
  "preferences": {
    "smokingAllowed": false,
    "chatsPreference": "quiet"
  }
}
```

- **Response:** Updated user object

### Rides

#### Create Ride

- **POST** `/api/rides`
- **Requires:** Authentication + Driver role
- **Request:**

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
  "genderPolicy": "any",
  "amenities": {
    "airConditioning": true,
    "aux": true
  }
}
```

#### Search Rides

- **POST** `/api/rides/search`
- **Requires:** Authentication + Email & Student ID verification
- **Request:**

```json
{
  "origin": "University Main Gate",
  "destination": "Downtown Station",
  "date": "2024-05-15",
  "filters": {
    "priceRange": [0, 10],
    "driverRating": 4,
    "luggageSpace": true
  },
  "safety": {
    "genderPolicy": "any"
  }
}
```

- **Response:** List of available rides

#### Get Ride Details

- **GET** `/api/rides/[rideId]`
- **Response:** Ride object with driver and booking info

#### Get My Rides

- **GET** `/api/rides/my-rides`
- **Requires:** Authentication
- **Response:** Rides posted by user + rides booked by user

### Bookings

#### Get Bookings

- **GET** `/api/bookings` - Get all user's bookings
- **GET** `/api/bookings/[bookingId]` - Get specific booking
- **Requires:** Authentication

#### Book a Ride

- **POST** `/api/rides/book`
- **Requires:** Authentication + Email & Student ID verification
- **Request:**

```json
{
  "rideId": "ride_id_here",
  "passengerCount": 1,
  "agreedToTerms": true
}
```

- **Response:** Booking confirmation with booking ID

#### Update Booking

- **PUT** `/api/bookings/[bookingId]`
- **Requires:** Authentication (driver or passenger)
- **Request:**

```json
{
  "status": "completed",
  "paymentStatus": "completed"
}
```

#### Cancel Booking

- **DELETE** `/api/bookings/[bookingId]`
- **Requires:** Authentication (driver or passenger)
- **Response:** Cancellation confirmation + refund

### Reviews

#### Get Reviews

- **GET** `/api/reviews` - Get all reviews
- **GET** `/api/reviews?userId=userId` - Get reviews for specific user
- **Response:** Reviews array + average rating

#### Create Review

- **POST** `/api/reviews`
- **Requires:** Authentication + completed booking
- **Request:**

```json
{
  "rideId": "ride_id",
  "bookingId": "booking_id",
  "revieweeId": "user_id",
  "rating": 5,
  "title": "Great ride!",
  "comment": "Driver was friendly and the car was clean",
  "categories": {
    "communication": 5,
    "cleanliness": 5,
    "driving": 5,
    "safety": 5
  },
  "type": "driver_review"
}
```

#### Delete Review

- **DELETE** `/api/reviews/[reviewId]`
- **Requires:** Authentication (reviewer only)

### Admin Endpoints

#### Dashboard Stats

- **GET** `/api/admin`
- **Requires:** Admin role
- **Response:**

```json
{
  "stats": {
    "totalUsers": 150,
    "totalRides": 450,
    "totalBookings": 1200,
    "totalReviews": 890,
    "drivers": 45,
    "passengers": 105,
    "activeRides": 23,
    "completedRides": 427
  },
  "recentUsers": [...],
  "recentRides": [...]
}
```

#### Manage Users

- **GET** `/api/admin/users` - List all users (with pagination & search)
- **PUT** `/api/admin/users/[userId]` - Update user verification/role
- **DELETE** `/api/admin/users/[userId]` - Delete user

#### Manage Rides

- **GET** `/api/admin/rides` - List all rides
- **PUT** `/api/admin/rides/[rideId]` - Update ride status
- **DELETE** `/api/admin/rides/[rideId]` - Delete ride

## Authentication

All protected endpoints require an Authorization header with JWT token:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained through login/registration and expire after 7 days.

## Safety Features

### Gender Policy Enforcement

- **Strict backend validation** - Gender policies are enforced server-side
- **Client cannot widen visibility** - Backend applies policy in query layer
- Supported policies:
  - `any` - Open to all
  - `women_only` - Women passengers only
  - `same_gender_only` - Same gender as driver

### User Verification

- Email verification required
- Student ID verification required
- Both required for booking rides

### Audit Logging

- Track policy-rejected booking attempts
- Generic error messages to prevent demographic leakage

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error responses include:

```json
{
  "error": "Error message",
  "details": [...] // Optional validation details
}
```

## Rate Limiting

Currently not implemented. Consider adding for production:

- Login attempts: 5 per minute
- Search: 30 per minute
- Booking: 10 per minute

## Deployment

### Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Set up MongoDB Atlas or production database
- [ ] Enable HTTPS/SSL
- [ ] Add rate limiting
- [ ] Set up email service for password resets
- [ ] Add payment gateway integration
- [ ] Set up error tracking (Sentry)
- [ ] Add logging and monitoring
- [ ] Enable CORS properly
- [ ] Add API key authentication if needed

## Testing

To test endpoints, use:

- Postman
- Thunder Client
- cURL

Example cURL:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@university.edu","password":"password"}'
```

## Future Enhancements

- [ ] Email verification flow
- [ ] Payment integration (Stripe)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced filtering (date, time, radius)
- [ ] Driver ratings and background checks
- [ ] In-app messaging between users
- [ ] Trip history and statistics
- [ ] Referral rewards program
- [ ] Emergency contact alerts
- [ ] Reports and dispute resolution
