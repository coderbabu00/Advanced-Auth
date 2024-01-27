# Advanced Authentication Backend Project

This repository showcases advanced authentication functionality implemented from scratch using Node.js and Express.js. The project provides a robust backend where users can experience various authentication features, including OTP verification, password reset, and OTP resend capabilities.

## Key Features:

- **OTP Verification:** Users can verify their email addresses using a secure OTP (One-Time Password) sent to their registered email.

- **Password Reset:** Forgot your password? No worries! Users can initiate a secure password reset process with a unique token sent to their email.

- **OTP Resend:** In case the OTP is missed or expired, users have the option to resend the OTP for email verification.

## Getting Started:

1. Clone this repository: `git clone https://github.com/coderbabu00/Advanced-Auth`
2. Navigate to the project folder: `cd advanced-authentication-demo`
3. Install dependencies: `npm install`
4. Set up your environment variables in a `.env` file.
5. Run the server: `npm start`

## API Endpoints:

- **User Registration:** `POST /api/users/register` - Create a new user account.

- **Email Verification:** `POST /api/users/verify-email` - Verify user email using OTP.

- **User Login:** `POST /api/users/login` - Authenticate and log in a user.

- **Password Reset Request:** `POST /api/forgot-password` - Initiate the password reset process.

- **Password Reset:** `POST /api/users/reset-password` - Complete the password reset with a valid reset token.

- **Resend OTP:** `POST /api/users/resend-otp` - Resend the OTP for email verification.

- **Resend Verification Link:** `POST /api/users/resend-verification-link` - Resend the email verification link.

## Testing:

All APIs have been thoroughly tested to ensure a reliable and secure user authentication experience. Feel free to explore and contribute to the project.

Happy coding!
