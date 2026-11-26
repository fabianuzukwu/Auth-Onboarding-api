# Auth and Onboarding API

A backend REST API that handles user registration, email verification, login, password recovery, onboarding and profile retrieval. It uses JWT for authentication and Joi for request validation.

## Table of Contents
- Features
- Tech Stack
- Project Structure
- Getting Started
- Environment Variables
- API Endpoints
- Validation Rules
- Security Notes
- Author

## Features
- User registration with a hashed password
- Email verification with a one-time code sent through Brevo
- Login with a JWT, blocked until the email is verified
- Forgot password and reset password with an expiring, single-use code
- User onboarding (phone number, gender, date of birth, optional profile image)
- Profile images uploaded to Cloudinary, then removed from the local uploads folder
- Authentication middleware that protects private routes
- Profile endpoints that never return the password or codes

## Tech Stack
- Node.js and Express
- MongoDB with Mongoose
- Joi (validation)
- bcrypt (password hashing)
- jsonwebtoken (authentication tokens)
- Multer (file upload handling)
- Cloudinary (profile image storage)
- Brevo (email delivery)

## Project Structure

```
user_onboarding
  config
    cloudinary.js: Cloudinary setup for image storage
  controllers
    user.js: logic for each endpoint
  database
    database.js: MongoDB connection
  middlewares
    authorization.js: verifies the JWT and protects private routes
    multer.js: handles the profile image upload
    userValidator.js: Joi validation for each route
  models
    user.js: Mongoose User model
  routers
    user.js: auth and user routes
  uploads: temporary storage; each image is uploaded to Cloudinary and then deleted from this folder
  utils
    email.js: sends emails through Brevo
  .env.example: environment variable names (the real .env is never committed)
  server.js: sets up the Express app, connects to the database and starts the server
```

## Getting Started
1. Clone the repository and open the project folder.
2. Install the dependencies with npm.
3. Create a file named .env in the project root.
4. Copy the variable names from .env.example into it and fill in your own values.
5. Start the server with the dev script (npm run dev).
6. The server runs on the port you set in PORT.

## Environment Variables
- PORT: port the server runs on
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: secret used to sign tokens
- JWT_EXPIRES_IN: how long a token stays valid
- BREVO_API_KEY: Brevo API key
- SENDER_EMAIL: verified sender email in Brevo
- SENDER_NAME: name shown to email recipients
- OTP_EXPIRY_MINUTES: how long a verification or reset code stays valid
- BCRYPT_SALT_ROUNDS: hashing cost for passwords
- [CLOUDINARY variable names from your .env.example]: Cloudinary account details

Never commit your real .env file. Only .env.example belongs in the repository.

## API Endpoints

Authentication
- POST /api/auth/register: register a new user
- POST /api/auth/verify-email: verify the user's email with a code
- POST /api/auth/login: log in and receive a token
- POST /api/auth/forgot-password: request a password reset code
- POST /api/auth/reset-password: reset the password with a code
- GET /api/auth/me: get the authenticated user (protected)

Users
- PATCH /api/users/onboarding: complete onboarding (protected, form-data, optional "profileImage" file)
- GET /api/users/profile: get the user's profile (protected)

Protected routes need an Authorization header made of the word Bearer, a space, and your token.

## Validation Rules
- Registration: first name and last name required; valid email; strong password (minimum length, uppercase, lowercase, number and special character); confirm password must match
- Login: valid email and password required
- Email verification: email and a code of the correct length
- Forgot password: valid email
- Reset password: email, code, and a new password that follows the same strength rules as registration
- Onboarding: valid phone number, gender from an allowed list, date of birth in the past; profile image must be an image file under 5mb

## Security Notes
- Verification and reset codes expire after 10 minutes and can only be used once.
- Forgot password gives the same response whether or not the email exists.
- Login gives the same error for a wrong email or a wrong password.
- A user can only complete onboarding once.
- Users can only access their own profile.

