# GlucoWave

GlucoWave is a React + Vite app for glucose tracking and prediction with Firebase authentication.

## Setup

1. Install dependencies:
   - `npm install`
2. Create your local env file:
   - `cp .env.example .env`
3. Fill all `VITE_FIREBASE_*` values in `.env` from your Firebase project settings.
4. Run locally:
   - `npm run dev`

## Firebase features

- Email/password signup and login
- Protected routes for app pages (`/dashboard`, `/predict`, `/analytics`, `/alerts`, `/onboarding`)
- Per-user personalization:
  - Profile stored in Firestore (`users/{uid}`)
  - User-specific local ML personalization keys (scoped by Firebase `uid`)
