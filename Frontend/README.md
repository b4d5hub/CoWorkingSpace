# CoWorkingSpace — Frontend

A modern, theme‑aware React + Vite + TypeScript frontend for a distributed co‑working space reservation system. It connects to a Spring Boot REST backend (with an RMI-based core) to provide real‑time room availability and booking across multiple branches in Morocco.

## ✨ Features

- Lightweight history routing (clean URLs without a router library)
- Public pages: Home, About Us, Contact Us, System Status, Login/Register
- Authenticated experience: Dashboard, Reservation flow, My Reservations, Profile
- Admin area: Rooms, Users, Validate Reservations, Stats
- Profile management with email/phone updates and password change
- Dark Mode (Light and Dark Blue themes) with persistence
- Consistent design system using theme‑aware tokens (`bg-background`, `bg-card`, `border-border`, etc.)

## 🧱 Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS utility classes and headless UI primitives (shadcn‑style components)
- Theme context (`ThemeContext`) for Light/Dark Blue modes
- Fetch/XHR via a minimal `apiRequest` helper

## 📂 Key Paths

- `src/App.tsx` — App shell, lightweight routing, guards, and data wiring
- `src/theme/ThemeContext.tsx` — Theme provider and toggle logic
- `src/lib/api.ts` — API base URL and request helper
- `src/components/*` — UI components and pages (Homepage, LoginPage, Dashboard, Admin*, AboutUs, ContactUs, etc.)

## 🔐 Routing & Access

The app uses a tiny history‑API router implemented in `App.tsx`.

- Public routes: `/`, `/login`, `/about`, `/contact`, `/status`
- Protected route: `/dashboard` (redirects to `/login` if unauthenticated)
- Other in‑app pages (navigated internally): reservation, my‑reservations, admin/*, profile, architecture

Header behavior:
- Guests see a public header (`PublicHeader`) matching the homepage styling, with a theme toggle and CTA.
- Authenticated users see the full `Navbar` (Dashboard, My Reservations, Admin for admins, Profile, Logout).

## ⚙️ Requirements

- Node.js 18+ (recommended LTS)
- npm 9+ (comes with Node.js)
- Running backend REST API (default assumed at `http://localhost:8082`)

## 🔧 Configuration

The frontend discovers the backend base URL from an environment variable at build/runtime.

- Variable: `VITE_API_BASE_URL`
- Default (if not set): `http://localhost:8082`

Ways to set it:

- Create a `.env` file in `Frontend/`:
  ```env
  VITE_API_BASE_URL=http://localhost:8082
  ```
- Or set it inline when running commands (PowerShell):
  ```powershell
  $env:VITE_API_BASE_URL="http://localhost:8082"; npm run dev
  ```

Reference: see `src/lib/api.ts`.

## 🚀 Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the development server
   ```bash
   npm run dev
   ```
   The app will start on `http://localhost:5173` (or the next available port).

3. (Optional) Configure the API URL (if your backend is not on `localhost:8082`). See Configuration above.

## 📦 Production Build

```bash
npm run build
npm run preview
```

`npm run build` outputs static assets to `dist/`. Use `npm run preview` to serve the built bundle locally.

## 🔑 Authentication Notes

- On login/register, the app stores `currentUser` in `localStorage` to persist sessions across refreshes.
- Profile updates (name, email, phone) are sent to the backend; email uniqueness conflicts return HTTP 409.
- Password change requires current password and new password (with confirmation on the client side).

## 🌓 Theming

- Toggle between Light and Dark Blue via the Sun/Moon button in the header (both guest and authenticated headers).
- Preference is saved to `localStorage` and applied instantly via a root CSS class (`dark-blue`). See `src/theme/ThemeContext.tsx`.

## 🧭 Page Overview

- Home (`/`): Marketing, locations, features, FAQ, CTAs, theme toggle
- About Us (`/about`): Mission, values, locations, technology
- Contact Us (`/contact`): Contact form (client‑side), locations, FAQ snippets
- Login/Register (`/login`): Tabs for authentication and account creation
- Dashboard (`/dashboard`): Browse rooms, filter by location, start reservations
- My Reservations: List and cancel reservations
- Admin: Rooms, Users, Validate (approve/reject), Stats
- Profile: Edit profile, change password
- System Status: Quick system info for users

## 🤝 Working With The Backend

- Ensure the Spring Boot REST service is running and CORS is enabled (project defaults to permissive CORS).
- Default port is 8082 in this project setup. Adjust `VITE_API_BASE_URL` if your port differs.

## 🧪 Tips & Troubleshooting

- API errors show toast messages; check the browser console for stack traces.
- If you see `HTTP 404/500` from the API, verify the backend URL and endpoints.
- If dark mode looks inconsistent, confirm your page uses theme‑aware classes (`bg-background`, `bg-card`, `bg-muted`, `border-border`, etc.).
- If navigation seems stuck, ensure your URL matches one of the supported routes (see `pathToPage` in `App.tsx`).

## 📝 Scripts (common)

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built assets locally

## 📄 License

This project is part of the CoWorkingSpace system and uses an MIT‑style license unless otherwise noted. See the repository root `README.md` for more details.
